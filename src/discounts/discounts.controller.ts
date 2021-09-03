import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { FileToBodyInterceptor } from 'src/support/interceptors/file-to-body.interceptor';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { Role } from 'src/users/enums/roles.enum';
import { DiscountsService } from './discounts.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { ReadDiscountDto } from './dto/read-discount.dto';

@Controller('discounts')
export class DiscountsController {
  constructor(private readonly discountsService: DiscountsService) {}

  @Post()
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('image'), new FileToBodyInterceptor('image'), new JwtUserToBodyInterceptor())
  async create(@Body() createDiscountDto: CreateDiscountDto): Promise<ReadDiscountDto> {
    return plainToClass(ReadDiscountDto, await this.discountsService.create(createDiscountDto));
  }
}
