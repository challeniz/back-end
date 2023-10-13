import mongoose, { Model, Types } from 'mongoose';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Challenge, ChallengeDocument } from './schema/challenge.schema';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';
import { UsersService } from 'src/users/users.service';
import { BadgesService } from 'src/badges/badges.service';
import { Cron, CronExpression } from '@nestjs/schedule';


@Injectable()
export class ChallengesService {
  constructor(@InjectModel(Challenge.name) private challengeModel: Model<ChallengeDocument>,
  @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
  private readonly badgesService: BadgesService) {}

  async create(user: any, createChallengeDto: CreateChallengeDto, file: Express.Multer.File) {
    let createChall = await new this.challengeModel(createChallengeDto);
    createChall.user = user._id;
    
    const ddd = file.path.split("/");
    const path = "/" + ddd[6] + "/" + ddd[7];
    createChall.mainImg = path;
    
    const result = await createChall.save();

    return result;
  }
  
  async findAll() {
    const ongoingChallenge = await this.challengeModel.find({ "status": "진행 중" }).limit(8);

    const orderByUsersChallenge = await this.challengeModel.find({ "status": "모집 중" }).sort({ "users": -1 }).limit(8);

    let orderByDateChallenge = await this.challengeModel.find({ "status": "모집 중" }).sort({"create_date": 1}).limit(8);
    orderByDateChallenge.reverse();

    return { ongoingChallenge, orderByUsersChallenge, orderByDateChallenge }
  }

  async findById(id: string) {
    const challenge = await this.challengeModel.findById(id);

    return challenge;
  }

  // userid로 신청한거나 만든 거 둘 다 찾기
  async findByUserIdAll(user: any) { // user 아이디
    const challenge = await this.challengeModel.find({$or: [ {"user": user._id}, {"users": {$in: [user._id]}}]});

    return challenge;
  }

  // 찜한 사람
  async findByZzimList(id: string) {
    const challenge = await this.challengeModel.find({ "like_users": `${id}` });

    return challenge;
  }

  async findList() {
    const challenge = await this.challengeModel.find({});

    return challenge;
  }


  async findByUser(id: string) {
    return await this.challengeModel.find({ "users": `${id}` }, {}, {lean: true});
  }

  
  async findOne(id: string) {
    let challenge = await this.challengeModel.findById(id);

    const user = await this.usersService.findById(challenge.user.toString());
    const name = user.name;
    const count = challenge.users.length;

    return { challenge, name, count };
  }
  

  async update(user:any, id: string, updateChallengeDto: UpdateChallengeDto, file?: Express.Multer.File) {
    const now = new Date();
    const challenge = await this.challengeModel.findById(id);


    if(!challenge) {
      throw new NotFoundException("찾는 챌린지가 존재하지 않습니다. 다시 확인해 주세요.");
    }

    let challDay = new Date(challenge.start_date);
    const diffDays = Math.floor((challDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if(diffDays <= 0) {
      throw new HttpException("챌린지가 시작되었으므로 수정할 수 없습니다.", HttpStatus.BAD_REQUEST);
    }

    const userId = user._id;
    const challUserId = challenge.user;

    if(!userId.equals(challUserId)) { 
      throw new UnauthorizedException("챌린지 생성자만 수정할 수 있습니다.");
    }
    
    challenge.description = updateChallengeDto.description;
    challenge.tag = updateChallengeDto.tag;

    if(file) {
      const tmp = file.path.split("/");
      const path = "/" + tmp[6] + "/" + tmp[7];
      challenge.mainImg = path;
    }

    const result = await challenge.save();

    return result;
  }


  async remove(user: any, id: string) {
    const now = new Date();

    const challenge = await this.challengeModel.findById({ _id: id});
    let challDay = new Date(challenge.start_date);

    const diffDays = Math.floor((challDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if(diffDays <= 0) {
      throw new HttpException("챌린지가 시작되었으므로 삭제할 수 없습니다.", HttpStatus.BAD_REQUEST);
    }

    if(challenge.users.length < 0) {
      throw new HttpException("신청한 사람이 존재하므로 삭제할 수 없습니다.", HttpStatus.BAD_REQUEST);
    }

    const userId = user._id;
    const challUserId = challenge.user;

    if(!userId.equals(challUserId)) { 
      throw new UnauthorizedException("챌린지 생성자만 삭제할 수 있습니다.");
    }

    const result = await this.challengeModel.deleteOne({ _id: id });
    return result? "챌린지 삭제 완료" : "챌린지 삭제 실패";
  }

  async getsub(user: any, id: string) {
    const challenge = await this.challengeModel.findById(id);

    if(!challenge) {
      throw new NotFoundException("찾는 챌린지가 존재하지 않습니다. 다시 확인해 주세요.");
    }

    const { name, phone, email } = user;
    
    return { challenge, name, phone, email };
  }

  async subscription(user: any, id: string) {
    const challenge = await this.challengeModel.findById(id);

    if(!challenge) {
      throw new NotFoundException("찾는 챌린지가 존재하지 않습니다. 다시 확인해 주세요.");
    }


    if(challenge.users.includes(user._id)) {
      throw new HttpException("이미 신청한 챌린지 입니다.", HttpStatus.BAD_REQUEST);
    }

    challenge.users.push(user);

    await this.badgesService.subBadge(user);

    return await challenge.save();;
  }

  async zzim(user: any, id: string): Promise<string> {
    const userId= user._id;

    let challenge = await this.challengeModel.findOne({ "_id": `${id}`, "like_users": `${userId}` });


    // 찜이 안되어있는 경우
    if(challenge == null) {
      const findChall = await this.challengeModel.findOne({ "_id": `${id}`});
      findChall.like_users.push(user);

      challenge = findChall;
      await challenge.save();

      return "찜 완료";
    }

    // 찜이 되어있는 경우
    challenge.like_users = challenge.like_users.filter((ele) => !userId.equals(new Types.ObjectId(`${ele}`)) );
    await challenge.save();
    

    return "찜 취소";
  }

  async cancel(user: any, id: string) {
    const userId = user._id;

    let challenge = await this.challengeModel.findOne({ "_id": `${id}`, "users": `${userId}` });
    console.log(challenge);

    if(challenge == null) {
      throw new HttpException("해당하는 챌린지가 없습니다. 다시 확인해 주세요", HttpStatus.BAD_REQUEST);
    }

    const now = new Date();
    let challDay = new Date(challenge.start_date);

    const diffDays = Math.floor((challDay.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if(diffDays <= 0) {
      throw new HttpException("챌린지가 시작되었으므로 삭제할 수 없습니다.", HttpStatus.BAD_REQUEST);
    }

    challenge.users = challenge.users.filter((ele) => !userId.equals(new Types.ObjectId(`${ele}`)) );
    await challenge.save();
    
    
   return "챌린지 신청 취소 완료";
  }


  // 인증 추가
  async postAdd( id: string, createPost, user: any) {
    let challenge = await this.challengeModel.findById(id);

    if(!challenge) {
      throw new NotFoundException("찾는 챌린지가 존재하지 않습니다. 다시 확인해 주세요.");
    }

    challenge.post.push(createPost._id);

    await this.usersService.verfiCountPlus(user._id);

    return await challenge.save();
  }

  // 챌린지 인증 목록 가져오기
  async getpost( id: string) {
    const challenge = await this.challengeModel.findById(id);

    if(!challenge) {
      throw new NotFoundException("찾는 챌린지가 존재하지 않습니다. 다시 확인해 주세요.");
    }

    return challenge;
  }
  
  // 챌린지 검색
  async searchChallenge( title: string) {
    //const challenge = await this.challengeModel.find({ title: {$regex: `${title}`} });
    const challenge = await this.challengeModel.aggregate([
      {
        $search: {
          index: "challSearch",
          text: {
            query: title,
            path: "title"
          }
        }
      }
    ]);

    return challenge;
  }

  // 개설한 챌린지 검색
  async getCreateChallenge( id: string) {
    const created = await this.challengeModel.find({ "user": id }, {}, { lean: true });

    return created;
  }

  async createReview(id: string, createdReview) {
    let challenge = await this.challengeModel.findById(id);

    if(!challenge) {
      throw new NotFoundException("찾는 챌린지가 존재하지 않습니다. 다시 확인해 주세요.");
    }


    // 신청한 사람이 아니면 에러
    if(!challenge.users.includes(createdReview.user._id)) {
      throw new HttpException("신청한 사람이 아니므로 후기를 작성할 수 없습니다.", HttpStatus.BAD_REQUEST);
    }

    challenge.review.push(createdReview._id);

    return await challenge.save();
  }

  async removeReview(id: string, reviewId: any){
    const challenge = await this.challengeModel.findById(id);

    if(!challenge) {
      throw new NotFoundException("찾는 챌린지가 존재하지 않습니다. 다시 확인해 주세요.");
    }
    reviewId = new mongoose.Types.ObjectId(reviewId);
    challenge.review = challenge.review.filter((ele) => !reviewId.equals(new Types.ObjectId(`${ele}`)) );

    await challenge.save();

    return "리뷰 삭제 완료";
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, { timeZone: 'Asia/Seoul'})
  async updateChallengeState() {
    const challenges = await this.challengeModel.find({});

    for(const challenge of challenges) {
      try {
        if(challenge.status == "완료") {
          continue;
        }

        const now = new Date(Date.now());
        if (new Date(challenge.recru_end_date) <= now && new Date(challenge.start_date) <= now && 
         new Date(challenge.end_date) > now ) {
          await this.challengeModel.updateOne({ _id: challenge._id }, { $set: { status: "진행 중"}});
        } else if (new Date(challenge.start_date) < now && new Date(challenge.end_date) <= now) {
          await this.challengeModel.updateOne({ _id: challenge._id }, { $set: { status: "완료"}});
        }
      } catch (error) {
        console.error(`Error updating challenge state: ${error.message}`);
      }
    }
  }
  
}
