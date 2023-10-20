import { BadRequestException, Inject, Injectable, UnauthorizedException, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Badge, BadgeDocument } from './schema/badge.schema';
import { Model } from 'mongoose';
import { BadgeList, BadgeListDocument } from './schema/badgeList.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BadgesService {
  constructor(@InjectModel(Badge.name) private badgeModel: Model<BadgeDocument>,
  @InjectModel(BadgeList.name) private badgeListModel: Model<BadgeListDocument>,
  @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService,
  ) {}

  async create(user: any, name: string, file: Express.Multer.File) {

    if(user.authority === false) {
      throw new UnauthorizedException("관리자만 접근할 수 있습니다.");
    } 
    
    const createBadge = await new this.badgeModel();
    createBadge.name = name;
    
    // 서버에 따라 변경
    const tmp = file.path.split("/");
    const path = "/" + tmp[6] + "/" + tmp[7];
    createBadge.img = path;

    return await createBadge.save();
  }

  async createBadgeList(user: any) {
    const badges = await this.badgeModel.find({});

    const isList = await this.badgeListModel.findOne({ "user._id": user._id });
    if(isList) {
      throw new BadRequestException("이미 배지 리스트가 존재합니다. 유저당 하나씩만 생성됩니다.");
    }

    const badgeList = new this.badgeListModel({
      list: [],
      user: user, 
    });

    for(const badge of badges) {
      const newBadge = new Badge(
        badge.name,
        badge.count,
        badge.obtain,
        badge.img,
      );
      badgeList.list.push(newBadge);
    }

    badgeList.list[0].obtain = true;

    return await badgeList.save();
  }

  async getBadgeList(usera: any) {
    const userId = usera._id;
    const badgeList = await this.badgeListModel.findOne({ "user": userId });

    if(!badgeList) {
      throw new BadRequestException("유저에 해당하는 뱃지 리스트가 없습니다.");
    }

    const user = await this.usersService.findById(userId);
    const list = badgeList.list;

    return { list, user };
  }

  async subBadge(user: any) {
    const badgeList = await this.badgeListModel.findOne({ "user._id": user._id });

    if(!badgeList) {
      throw new BadRequestException("유저에 해당하는 뱃지 리스트가 없습니다.");
    }

    if(badgeList.list[2].obtain === false) {
      badgeList.list[2]= {
        ...badgeList.list[2],
        count: 1,
        obtain: true
      }
      return await badgeList.save();
    }

    badgeList.list[2] = {
      ...badgeList.list[2],
      count: badgeList.list[2].count+1
    }

    return await badgeList.save();
  }

  async allcategoryBadge(user: any) {
    const badgeList = await this.badgeListModel.findOne({ "user._id": user._id });

    if(!badgeList) {
      throw new BadRequestException("유저에 해당하는 뱃지 리스트가 없습니다.");
    }

    
  }

  async reviewBadge(user: any) {
    const badgeList = await this.badgeListModel.findOne({ "user._id": user._id });

    if(!badgeList) {
      throw new BadRequestException("유저에 해당하는 뱃지 리스트가 없습니다.");
    }
  }

}
