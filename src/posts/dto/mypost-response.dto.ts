import { ApiProperty } from '@nestjs/swagger';
import { Post } from '../schema/post.schema';

export class MyPostResponse {

    @ApiProperty({
        example: "리팩토링 성공하기",
        description: "챌린지 제목",
        required: true
    })
    title: string;

    @ApiProperty({
        example: "2023-09-10T15:00:00.000Z",
        description: "챌린지 모집 시작 날짜",
        required: true
    })
    recru_open_date: Date;

    @ApiProperty({
        example: "2023-09-17T14:59:59.999Z",
        description: "챌린지 모집 종료 날짜",
        required: true
    })
    recru_end_date: Date;

    @ApiProperty({
        example: "2023-09-10T15:00:00.000Z",
        description: "챌린지 시작 날짜",
        required: true
    })
    start_date: Date;

    @ApiProperty({
        example: "2023-09-10T15:00:00.000Z",
        description: "챌린지 종료 날짜",
        required: true
    })
    end_date: Date;

    @ApiProperty({
        type: [Post],
        description: "해당 챌린지의 내가한 인증 목록들",
        required: false
    })
    posts: Array<Post>;
}
