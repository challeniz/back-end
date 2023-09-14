import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import * as bcrypt from 'bcrypt';
import { ChallengesService } from 'src/challenges/challenges.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,
  @Inject(forwardRef(() => ChallengesService)) private readonly challengeService: ChallengesService) {}

  async create(user: User) {
    const isEmail = user.email;

    const isUser = await this.userModel.findOne({ email: isEmail });

    if(isUser) {
      throw new BadRequestException("이 이메일은 이미 존재합니다. 다른 이메일을 사용해주세요.");
    }

    let createdUser = new this.userModel(user);
    createdUser.password =  await bcrypt.hash(createdUser.password, 10);
    createdUser.save()

    return '회원가입 완료'; // 회원 가입 완료만 리턴?
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
    let challenge = await this.challengeService.findByUser(user.id);
    // 신청한 챌린지중에서 상태만 나눔
    const finishChallenge = challenge.filter((ele) => ele.status == "완료");
    challenge = challenge.filter((ele) => ele.status != "완료");
    // 찜한 것
    const zzimChallenge = await this.challengeService.findByZzimList(user.id);
    // 내가 만든것
    const createChallenge = await this.challengeService.getCreateChallenge(user.id);
    

    const { name, grade } = user;

    return { challenge, zzimChallenge, createChallenge, finishChallenge ,name, grade };
  }

  async remove(user: any) {
    const result = await this.userModel.deleteOne({ _id: user._id });

    return result? "회원 탈퇴 완료" : "회원 탈퇴 실패";
  }

  async updateInfo(user: any, updateUserDto: UpdateUserDto) {
    const password = updateUserDto.password;
    updateUserDto.password = await bcrypt.hash(password, 10);

    await this.userModel.updateOne( { _id: user._id }, { $set: updateUserDto });

    const findUser = this.userModel.findById(user._id);

    return findUser;
  }
}
