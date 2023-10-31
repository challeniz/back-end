import { ApiProperty } from '@nestjs/swagger';

export class LoginUserResponseDto {
    @ApiProperty({
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTM2N2RlYzMyZmU4ODE0NzIzN2JlM2QiLCJhdXRob3JpdHkiOmZhbHNlLCJpYXQiOjE2OTgyMzY2MTIsImV4cCI6MTY5ODI0MDIxMn0.nMqrw1eh9YJ_pXuTgelskRhpU1ydn58ktb6oeZveoF0",
        description: "기본적으로 사용되는 토큰",
        required: true
    })
    access_token: string;

    @ApiProperty({
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTM2N2RlYzMyZmU4ODE0NzIzN2JlM2QiLCJpYXQiOjE2OTgyMzY2MTIsImV4cCI6MTY5ODI0MDIxMn0.aIXdeKM2XQhTcOEC-nZdhEH5uccojdlOxU9Vs0Fp1xs",
        description: "토큰을재발급할때 사용되는 토큰",
        required: true
    })
    refresh_token: string;
}