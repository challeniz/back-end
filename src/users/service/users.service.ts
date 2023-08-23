import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>,) {}

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
    //const challenge = await this.userModel.findById();

    return user;
  }

  async remove(id: ObjectId) {
    const result = await this.userModel.deleteOne({ _id: id });

    return result? "회원 탈퇴 완료" : "회원 탈퇴 실패";
  }
}
