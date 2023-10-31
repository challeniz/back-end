
import { ApiProperty } from '@nestjs/swagger';
import { Review } from '../schema/review.schema';

export class ReviewResponse {

    @ApiProperty({
        description: "리뷰",
        required: true
    })
    review: Review;

    @ApiProperty({
        example: "관리자",
        description: "리뷰 작성자",
        required: true
    })
    name: string;

}
