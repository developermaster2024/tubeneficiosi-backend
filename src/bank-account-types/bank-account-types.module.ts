import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BankAccountTypesController } from './bank-account-types.controller';
import { BankAccountTypesService } from './bank-account-types.service';
import { BankAccountType } from './entities/bank-account-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BankAccountType])],
  controllers: [BankAccountTypesController],
  providers: [BankAccountTypesService]
})
export class BankAccountTypesModule {}
