import { Body, Controller, Get, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ReadClientDto } from 'src/clients/dto/read-client.dto';
import { FileToBodyInterceptor } from 'src/support/interceptors/file-to-body.interceptor';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { Role } from 'src/users/enums/roles.enum';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  @Roles(Role.CLIENT)
  @UseGuards(RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async findOne(@Body('userId') userId: number): Promise<ReadClientDto> {
    return plainToClass(ReadClientDto, await this.profileService.findOne(userId));
  }

  @Put()
  @Roles(Role.CLIENT)
  @UseGuards(RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  @UseInterceptors(FileInterceptor('img', {dest: 'uploads/users/'}), new FileToBodyInterceptor('img'))
  async update(@Body() updateProfileDto: UpdateProfileDto): Promise<ReadClientDto> {
    return plainToClass(ReadClientDto, await this.profileService.update(updateProfileDto));
  }

  @Put('password')
  @Roles(Role.CLIENT)
  @UseGuards(RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto): Promise<ReadClientDto> {
    return plainToClass(ReadClientDto, await this.profileService.updatePassword(updatePasswordDto));
  }
}
