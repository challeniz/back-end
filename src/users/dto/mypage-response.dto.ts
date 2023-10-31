import { ApiProperty } from '@nestjs/swagger';
import { Challenge } from 'src/challenges/schema/challenge.schema';

export class MypageResponseDto {
    @ApiProperty({
        type: [Challenge],
        description: "신청한 챌린지",
        required: true
    })
    updateActiveChallenge: Array<Challenge>;

    @ApiProperty({
        type: [Challenge],
        description: "찜한 챌린지",
        required: true
    })
    zzimChallenge: Array<Challenge>;

    @ApiProperty({
        type: [Challenge],
        description: "생성한 챌린지",
        required: true
    })
    updateCreateChallenge: Array<Challenge>;

    @ApiProperty({
        type: [Challenge],
        description: "신청한 챌린지 중 완료된 챌린지",
        required: true
    })
    finishChallenge: Array<Challenge>

    @ApiProperty({
        example: "관리자",
        description: "회원 이름",
        required: true
    })
    name: string;

    @ApiProperty({
        example: "주니어챌리니",
        description: "회원 등급",
        required: true
    })
    grade: string;
}