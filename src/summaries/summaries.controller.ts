import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/users/enums/roles.enum';
import { ClientsSummaryDto } from './dto/clients-summary.dto';
import { DashboardSummaryDto } from './dto/dashboard-summary.dto';
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
}
