import { Model, ObjectId, Types } from 'mongoose';
import { HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Challenge, ChallengeDocument } from './schema/challenge.schema';
import { CreateChallengeDto } from './dto/create-challenge.dto';
import { UpdateChallengeDto } from './dto/update-challenge.dto';

@Injectable()
export class ChallengesService {
  constructor(@InjectModel(Challenge.name) private challengeModel: Model<ChallengeDocument>) {}

  async create(user: any, createChallengeDto: CreateChallengeDto) {
    const createChall = new this.challengeModel(createChallengeDto);
    createChall.user = user._id;

    createChall.save();
    return '챌린지 생성 완료!';
  }
  
  async findAll() {
    return  this.challengeModel.find({});
  }

  async findByUser(id: string) {
    return this.challengeModel.find({ "users": `${id}` });
  }

  async findOne(id: string) {
    const challenge = await this.challengeModel.findById(id);
    return challenge;
  }

  async update(user:any, id: string, updateChallengeDto: UpdateChallengeDto) {
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

    /*
    if(challenge.user.equals(user._id)) { 
      throw new UnauthorizedException("챌린지 생성자만 수정할 수 있습니다.");
    }
    */
    

    challenge.description = updateChallengeDto.description;
    challenge.mainImg = updateChallengeDto.mainImg;
    challenge.tag = updateChallengeDto.tag;

    challenge.save();

    return "수정 완료";
  }


  async remove(id: string): Promise<string> {
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

    challenge.users.push(user);
    challenge.save();

    return "신청 완료";
  }

  async zzim(user: any, id: string): Promise<string> {
    const userId= user._id;

    let challenge = await this.challengeModel.findOne({ "_id": `${id}`, "like_users": `${userId}` });


    // 찜이 안되어있는 경우
    if(challenge == null) {
      const findChall = await this.challengeModel.findOne({ "_id": `${id}`});
      findChall.like_users.push(user);

      challenge = findChall;
      console.log(challenge);
      challenge.save();

      return "찜 완료";
    }

    // 찜이 되어있는 경우
    challenge.like_users = challenge.like_users.filter((ele) => !userId.equals(new Types.ObjectId(`${ele}`)) );
    challenge.save();
    

    return "찜 취소";
  }
}
