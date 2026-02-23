import { ApiProperty } from '@nestjs/swagger';

export class AdminRegisterDto {
  @ApiProperty({ description: 'Admin network ID', example: 'net12345' })
  networkId: string;

  @ApiProperty({ description: 'Admin display name', example: 'John Doe' })
  name: string;
}

