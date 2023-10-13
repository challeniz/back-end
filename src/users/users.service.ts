import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { ChallengesService } from 'src/challenges/challenges.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadgesService } from 'src/badges/badges.service';
import { PostsService } from 'src/posts/posts.service';
import { ObjectId } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
  @Inject(forwardRef(() => ChallengesService)) private readonly challengeService: ChallengesService,
  @Inject(forwardRef(() => BadgesService)) private readonly badgesService: BadgesService,
  private readonly postsService: PostsService) {}

  async create(user: User) {
    const isEmail = user.email;

    const isUser = await this.userModel.findOne({ email: isEmail });

    if(isUser) {
      throw new BadRequestException("이 이메일은 이미 존재합니다. 다른 이메일을 사용해주세요.");
    }

    let createdUser = new this.userModel(user);
    createdUser.password =  await bcrypt.hash(createdUser.password, 10);

    const result = await createdUser.save();

    await this.badgesService.createBadgeList(result);
    
    return "회원 가입 완료"; // 회원 가입 완료만 리턴?
  }

  async logout(user: any) {
    const isUser = await this.userModel.findById(user._id);

    await this.userModel.updateOne({ _id: isUser._id, $set: { refreshToken: null, refreshTokenDate: null }});
  }

  async doubleCheck(email: string) {
    const user = await this.userModel.findOne({ email });

    // 중복되는 이메일이 있으면 true 없으면 false
    return user ? true : false;
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);

    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    return user;
  }

  async mypageChall(user: any) {
    const challenge: any = await this.challengeService.findByUser(user.id);
    // 신청한 챌린지중에서 상태만 나눔
    const finishChallenge = challenge.filter((ele) => ele.status == "완료");
    const activeChallenge = challenge.filter((ele) => ele.status != "완료");

    // 오늘 날짜에 작성한 포스트가 있는지 확인하여 리턴
    const updateChallenge = async (chall) => {
      if(chall.post.length <= 0) {
        return { ...chall, isPost: false };
      }

      let isPostFound = false;
      const posts = await this.postsService.getpost(chall._id);

      const now: Date = new Date();
      now.setHours(now.getHours() + 9);

      for(const post of posts) {
        // 새로 만들고 난후 삭제
        if( post == null) {
          continue;
        }
        const pdate = new Date(post.post_date);
        if(post.user._id.equals(user._id) && now.getFullYear() === pdate.getFullYear()
        && now.getMonth() === pdate.getMonth()
        && now.getDate() === pdate.getDate()) {
          isPostFound = true;
          break;
        }
      }
      return { ...chall, isPost: isPostFound };
    };

    const updateActiveChallenge = await Promise.all(activeChallenge.map(updateChallenge));
    
    // 찜한 것
    const zzimChallenge = await this.challengeService.findByZzimList(user.id);
    // 내가 만든것
    const createChallenge = await this.challengeService.getCreateChallenge(user.id);
    const updateCreateChallenge = await Promise.all(createChallenge.map(updateChallenge));
    

    const { name, grade } = user;

    return { updateActiveChallenge, zzimChallenge, updateCreateChallenge, finishChallenge , name, grade };
  }

  async remove(user: any) {
    const result = await this.userModel.deleteOne({ _id: user._id });

    return result? "회원 탈퇴 완료" : "회원 탈퇴 실패";
  }

  async updateInfo(user: any, updateUserDto: UpdateUserDto, file?: Express.Multer.File) {
    const password = updateUserDto.password;
    updateUserDto.password = await bcrypt.hash(password, 10);
    
    if(file) {
      const tmp = file.path.split("/");
      const path = "/" + tmp[6] + "/" + tmp[7];
      updateUserDto.img = path;
    }

    await this.userModel.updateOne( { _id: user._id }, { $set: updateUserDto });

    const findUser = this.userModel.findById(user._id);

    return findUser;
    
  }

  async verfiCountPlus(id: string) {
    const user = await this.userModel.findById(id);

    const count = user.verifiCount+1;
    user.verifiCount = count;

    if(count > 14 && count < 30) {
      user.grade = "주니어챌리니";
    } else if( count >= 30 && count < 50) {
      user.grade = "시니어챌리니";
    } else if(count > 50) {
      user.grade = "전문챌리니";
    }

    await this.userModel.updateOne({ _id: id }, { $set: user });

    const findUser = this.userModel.findById(user._id);

    return findUser;
  }

  async setRefreshToken(refreshToken: string, loginUserDto: LoginUserDto) {
    const curRefreshToken = await bcrypt.hash(refreshToken, 10);

    const now = new Date();
    const curRefreshTokenDate = new Date(now.getTime()+(9*3600000));
    curRefreshTokenDate.setHours(curRefreshTokenDate.getHours() + 1);
    console.log(curRefreshTokenDate);

    return await this.userModel.updateOne({ email: loginUserDto.email,
       $set: { refreshToken: curRefreshToken, refreshTokenDate: curRefreshTokenDate }});
  }

  async userRefreshTokenMatch(refresh_token: string, userId) {
    const user = await this.userModel.findById(userId);

    if (!user.refreshToken) {
      return null;
    }
	
    const refreshTokenMatch = await bcrypt.compare(refresh_token, user.refreshToken);

    if (refreshTokenMatch) {
      return user;
    } 
  }

}
