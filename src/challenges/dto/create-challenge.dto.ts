import { ApiProperty } from '@nestjs/swagger';

export class CreateChallengeDto {
    @ApiProperty({
        example: "오전에 물 한잔",
        description: "챌린지 제목",
        required: true
    })
    title: string;

    @ApiProperty({
        example: "식습관",
        description: "챌린지 카테고리",
        required: true
    })
    category: string;

    @ApiProperty({
        example: "2023-11-06T14:59:59.999+00:00",
        description: "챌린지 시작 날짜",
        required: true
    })
    start_date: Date;

    @ApiProperty({
        example: "2023-12-25T14:59:59.999+00:00",
        description: "챌린지 종료 날짜",
        required: true
    })
    end_date: Date;

    @ApiProperty({
        example: "매일 오전에 물 한잔을 마시는 챌린지 입니다. 깨끗한 피부를 가꾸고 싶으신 분, 체중 감량이 목표인 다이어터에게 추천합니다.",
        description: "챌린지 설명",
        required: true
    })
    description: string;

    @ApiProperty({
        description: "챌린지 태그들, 최대 3개",
        required: true
    })
    tag: Array<string>;

    @ApiProperty({
        example: "2023-10-28T15:00:00.000+00:00",
        description: "챌린지 모집 시작 날짜",
        required: true
    })
    recru_open_date: Date;

    @ApiProperty({
        example: "2023-11-05T14:59:59.999+00:00",
        description: "챌린지 모집 종료 날짜",
        required: true
    })
    recru_end_date: Date;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: "이미지",
        required: true
    })
    file: string;
}
