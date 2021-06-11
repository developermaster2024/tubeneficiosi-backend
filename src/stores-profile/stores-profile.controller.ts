import { Body, Controller, Get, Put, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdatePasswordDto } from 'src/profile/dto/update-password.dto';
import { ReadStoreDto } from 'src/stores/dto/read-store.dto';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { Role } from 'src/users/enums/roles.enum';
import { UpdateStoreProfileDto } from './dto/update-store-profile.dto';
import { StoresProfileService } from './stores-profile.service';

@Controller('stores-profile')
@UseGuards(JwtAuthGuard)
export class StoresProfileController {
  constructor(private readonly storesProfileService: StoresProfileService) {}

  @Get()
  @Roles(Role.STORE)
  @UseGuards(RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async findOne(@Body('userId') userId: number): Promise<ReadStoreDto> {
    return plainToClass(ReadStoreDto, await this.storesProfileService.findOne(userId));
  }

  @Put()
  @Roles(Role.STORE)
  @UseGuards(RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  @UseInterceptors(FileFieldsInterceptor([
    {name: 'banner', maxCount: 1},
    {name: 'logo', maxCount: 1},
    {name: 'frontImage', maxCount: 1},
  ], {dest: 'uploads/stores/'}))
  async update(
    @Body() updateStoreProfile: UpdateStoreProfileDto,
    @UploadedFiles() images
  ): Promise<ReadStoreDto> {
    return plainToClass(ReadStoreDto, await this.storesProfileService.update(updateStoreProfile, {
      banner: images?.banner?.[0]?.path,
      logo: images?.logo?.[0]?.path,
      frontImage: images?.frontImage?.[0]?.path,
    }))
  }

  @Put('password')
  @Roles(Role.STORE)
  @UseGuards(RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto): Promise<ReadStoreDto> {
    return plainToClass(ReadStoreDto, await this.storesProfileService.updatePassword(updatePasswordDto));
  }
}
