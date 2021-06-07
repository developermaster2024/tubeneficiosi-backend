import { Body, Controller, Get, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { ReadClientDto } from 'src/clientes/dto/read-client.dto';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async findOne(@Body('userId') userId: number): Promise<ReadClientDto> {
    return plainToClass(ReadClientDto, await this.profileService.findOne(userId));
  }

  @Put()
  @UseInterceptors(new JwtUserToBodyInterceptor())
  @UseInterceptors(FileInterceptor('img', {dest: 'uploads/users/'}))
  async update(
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() img: Express.Multer.File
  ): Promise<ReadClientDto> {
    return plainToClass(ReadClientDto, await this.profileService.update(updateProfileDto, img.path));
  }
}
