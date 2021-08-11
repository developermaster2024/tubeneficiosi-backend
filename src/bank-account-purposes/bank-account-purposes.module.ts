import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountPurposesController } from './bank-account-purposes.controller';
import { BankAccountPurposesService } from './bank-account-purposes.service';
import { BankAccountPurpose } from './entities/bank-account-purpose.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccountPurpose])],
  controllers: [BankAccountPurposesController],
  providers: [BankAccountPurposesService]
})
export class BankAccountPurposesModule {}
