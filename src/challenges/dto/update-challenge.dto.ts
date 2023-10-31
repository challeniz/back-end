import { PartialType } from '@nestjs/mapped-types';
import { CreateChallengeDto } from './create-challenge.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChallengeDto extends PartialType(CreateChallengeDto) {

    @ApiProperty({
        description: "수정할 챌린지 내용",
        required: false
    })
    description?: string;

    @ApiProperty({
        description: "수정할 챌린지 태그",
        required: false
    })
    tag?: string[];

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: "이미지",
        required: false
    })
    file?: string;
}
