
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {

    @ApiProperty({
        example: "653a6694c8f1516bfb6017e6",
        description: "챌린지 _id",
        required: true
    })
    challengeId: string;

    @ApiProperty({
        example: "환경을 지키는데 노력을 정말 많이 해야할꺼같아요~",
        description: "리뷰 내용",
        required: true
    })
    content: string;

    @ApiProperty({
        example: "4",
        description: "리뷰 별점",
        required: true
    })
    star: number
}
