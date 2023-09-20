import { Model } from 'mongoose';
import { forwardRef, HttpException, HttpStatus, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post, PostDocument } from './schema/post.schema';
import { ChallengesService } from 'src/challenges/challenges.service';
import { UsersService } from 'src/users/users.service';
import { time } from 'console';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>,
  private readonly challengeService: ChallengesService, 
  @Inject(forwardRef(() => UsersService)) private readonly usersService: UsersService) {}
  

  async create(user: any, file : Express.Multer.File, createPostDto: CreatePostDto, id: string) {
    let challenge = await this.challengeService.findById(id);

    if(!challenge) {
      throw new NotFoundException("찾는 챌린지가 존재하지 않습니다. 다시 확인해 주세요.");
    }

    if(!challenge.users.includes(user._id) && !user._id.equals(challenge.user)) {
      throw new HttpException("접근할 수 있는 챌린지가 아닙니다. 다시 확인해주세요", HttpStatus.BAD_REQUEST);
    }
    
    let createPost = await new this.postModel(createPostDto);
    createPost.user = user;

    const tmp = file.path.split("/");

    // 서버 디렉토리에 맞게 바꿔야함
    createPost.img = "/" + tmp[6] + "/"+tmp[7];

    
    await createPost.save();
    
    return await this.challengeService.postAdd( id , createPost, user);
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

  async mypost(user: any) {
    const challenge = await this.challengeService.findByUserIdAll(user);

    let challPost = [];
    challenge.forEach(chall => challPost.push({ title: chall.title, posts: chall.post }));

    const posts = [];

    for(const chall of challPost) {
      if(chall.posts.length > 0) {
        for(const post of chall.posts) {
          const ispost = await this.postModel.findById(post);
          if (user.email == ispost.user.email) {
            posts.push({ title: chall.title, posts: ispost });
            console.log(posts);
         }
        } 
      } else {
        posts.push(chall);
      }
    }

    return posts;
  }

}