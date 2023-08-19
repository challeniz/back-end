import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { User, UserDocument } from '../schema/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // dto를 사용하는 것이 좋을까?
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

  async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });

    return user;
  }

  /*
  async login(loginUserDto: LoginUserDto) {
    const user = await this.userModel.findOne({ email: loginUserDto.email });

    if(!user) {
      throw new BadRequestException("해당하는 회원이 존재하지 않습니다. 다시 한 번 확인해 주세요.");
    }

    const passwordMatch = await bcrypt.compare(loginUserDto.password, user.password);
    console.log(passwordMatch);

    if(!passwordMatch) {
      throw new BadRequestException("비밀번호가 일치하지 않습니다. 다시 확인해 주세요.");
    }

    const id = user._id;
    const authority = user.authority;

    const secretKey = process.env.JWT_SECRET_KEY;
    //const token = jwt.sign({ id, authority }, secretKey);

    //const loginUser = { token, id, authority };

    //return loginUser;
  }
  */

  async update(id: ObjectId) {
    return `This action updates a #${id} user`;
  }

  async remove(id: ObjectId) {
    return `This action removes a #${id} user`;
  }
}
