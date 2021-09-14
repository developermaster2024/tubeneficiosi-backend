import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { Role } from 'src/users/enums/roles.enum';
import { ToggleFavoriteStoreDto } from './dto/toggle-favorite-store.dto';
import { FavoriteStoresService } from './favorite-stores.service';

@Controller('favorite-stores')
export class FavoriteStoresController {
  constructor(private readonly favoriteStoresService: FavoriteStoresService) {}

  @Post(':storeId')
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new ParamsToBodyInterceptor({ storeId: 'storeId' }), new JwtUserToBodyInterceptor())
  async toggle(@Body() toggleFavoriteStoreDto: ToggleFavoriteStoreDto): Promise<boolean> {
    return await this.favoriteStoresService.toggle(toggleFavoriteStoreDto);
  }
}
