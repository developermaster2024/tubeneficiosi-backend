import { Body, Controller, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { ParamsToBodyInterceptor } from 'src/support/interceptors/params-to-body.interceptor';
import { Role } from 'src/users/enums/roles.enum';
import { ClientCardsService } from './client-cards.service';
import { ToggleClientCardDto } from './dto/toggle-client-card.dto';

@Controller('client-cards')
export class ClientCardsController {
  constructor(private readonly clientCardsService: ClientCardsService) {}

  @Post(':cardId')
  @Roles(Role.CLIENT)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor(), new ParamsToBodyInterceptor({ cardId: 'cardId' }))
  async toggle(@Body() toggleClientCardDto: ToggleClientCardDto): Promise<boolean> {
    return await this.clientCardsService.toggle(toggleClientCardDto);
  }
}
