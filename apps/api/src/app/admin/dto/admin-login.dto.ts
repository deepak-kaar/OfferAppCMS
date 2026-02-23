import { ApiProperty } from '@nestjs/swagger';

export class AdminLoginDto {
  @ApiProperty({ description: 'Admin network ID', example: 'net12345' })
  networkId: string;

  @ApiProperty({
    description: 'Admin password (not stored, used only for login verification)',
    example: 'P@ssw0rd!',
  })
  password: string;
}

