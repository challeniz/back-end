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
    createPost.img = file.path;

    await createPost.save();
    // 챌린지는 _id만 저장하니까..
    return await this.challengeService.postAdd( id , createPost);
  }

  findAll() {
    return `This action returns all posts`;
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
