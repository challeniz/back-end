import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {

    @ApiProperty({
        description: "인증 내용",
        required: true
    })
    description: string;

    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: "이미지",
        required: true
    })
    file?: string;
}
