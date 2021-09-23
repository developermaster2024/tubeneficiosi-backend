import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { Role } from 'src/users/enums/roles.enum';
import { RateStoreDto } from './dto/rate-store.dto';
import { StoreRating } from './entities/store-rating.entity';
import { StoreRatingsService } from './store-ratings.service';

@Controller('store-ratings')
export class StoreRatingsController {
  constructor(private readonly storeRatingsService: StoreRatingsService) {}

  @Post(':storeId')
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ storeId: 'storeId' }))
  async rateStore(@Body() rateStoreDto: RateStoreDto): Promise<StoreRating> {
    return await this.storeRatingsService.rateStore(rateStoreDto);
  }
}
