import { ApiProperty } from '@nestjs/swagger';
import { Challenge } from '../schema/challenge.schema';

export class findMainResponseDto {

    @ApiProperty({
        type: [Challenge],
        description: "진행중인 챌린지",
        required: true
    })
    ongoingChallenge: string;

    @ApiProperty({
        type: [Challenge],
        description: "모집 인원이 많은 순서대로 챌린지",
        required: true
    })
    orderByUsersChallenge: string;

    @ApiProperty({
        type: [Challenge],
        description: "최근 만들어진 챌린지",
        required: true
    })
    orderByDateChallenge: Date;

}
