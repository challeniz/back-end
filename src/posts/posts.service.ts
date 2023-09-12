import { Model } from 'mongoose';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schema/post.schema';
import { ChallengesService } from 'src/challenges/challenges.service';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>,
  private readonly challengeService: ChallengesService) {}
  

  async create(user: any, file : Express.Multer.File, createPostDto: CreatePostDto, id: string) {
    let challenge = await this.challengeService.findById(id);

    if(!challenge) {
      throw new NotFoundException("찾는 챌린지가 존재하지 않습니다. 다시 확인해 주세요.");
    }

    if(!challenge.users.includes(user._id)) {
      throw new HttpException("신청하신 챌린지가 아닙니다. 다시 확인해주세요", HttpStatus.BAD_REQUEST);
    }
    
    let createPost = await new this.postModel(createPostDto);

    createPost.user = user;
    const tmp = file.path.split("/");
   const path = "/" + tmp[5] + "/"+tmp[6];

    await createPost.save();
    // 챌린지는 _id만 저장하니까..
    return await this.challengeService.postAdd( id , createPost);
  }
  
  async getpost(id: string) {
    let challenge = await this.challengeService.findById(id);

    if(!challenge) {
      throw new NotFoundException("찾는 챌린지가 존재하지 않습니다. 다시 확인해 주세요.");
    }

    const posts = [];

    for(let i = 0; i<challenge.post.length; i++) {
      posts.push(await this.postModel.findOne({ _id: challenge.post[i]}));
    }

    return posts;
  }

  findAll() {
    let dd = '/home/elice/front-end/public/posts/EAT_green_1693586742270.jpg';
    let aa = dd.split("/");
    return "/"+aa[5]+"/"+aa[6];
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
