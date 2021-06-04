import { Body, Controller, Put, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ReadProfileDto } from './dto/read-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Put()
  @UseInterceptors(new JwtUserToBodyInterceptor())
  @UseInterceptors(FileInterceptor('img', {dest: 'uploads/users/'}))
  async update(
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() img: Express.Multer.File
  ): Promise<ReadProfileDto> {
    return plainToClass(ReadProfileDto, await this.profileService.update(updateProfileDto, img.path));
  }
}
