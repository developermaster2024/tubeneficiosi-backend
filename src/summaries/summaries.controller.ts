import { Body, Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { JwtUserToBodyInterceptor } from 'src/support/interceptors/jwt-user-to-body.interceptor';
import { Role } from 'src/users/enums/roles.enum';
import { ClientsSummaryDto } from './dto/clients-summary.dto';
import { DashboardSummaryDto } from './dto/dashboard-summary.dto';
import { DiscountsSummaryDto } from './dto/discounts-summary.dto';
import { StoreDiscountsSummary } from './dto/store-discounts-summary.dto';
import { TagsSummaryDto } from './dto/tags-summary.dto';
import { SummariesService } from './summaries.service';

@Controller('summaries')
export class SummariesController {
  constructor(private readonly summariesService: SummariesService) {}

  @Get('dashboard')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async dashboardSummary(): Promise<DashboardSummaryDto> {
    return await this.summariesService.dashboardSummary();
  }

  @Get('clients')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async clientsSummary(): Promise<ClientsSummaryDto> {
    return await this.summariesService.clientsSummary();
  }

  @Get('tags')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async tagsSummary(): Promise<TagsSummaryDto> {
    return plainToClass(TagsSummaryDto, await this.summariesService.tagsSummary());
  }

  @Get('discounts')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async discountsSummary(): Promise<DiscountsSummaryDto> {
    return plainToClass(DiscountsSummaryDto, await this.summariesService.discountsSummary());
  }

  @Get('store-discounts')
  @Roles(Role.STORE)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(new JwtUserToBodyInterceptor())
  async storeDiscountsSummary(@Body('userId') userId: number): Promise<StoreDiscountsSummary> {
    return plainToClass(StoreDiscountsSummary, await this.summariesService.storeDiscountsSummary(userId));
  }
}
