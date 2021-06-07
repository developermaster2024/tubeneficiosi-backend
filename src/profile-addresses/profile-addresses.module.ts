import { Module } from '@nestjs/common';
import { ProfileAddressesService } from './profile-addresses.service';
import { ProfileAddressesController } from './profile-addresses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileAddress } from './entities/profile-address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileAddress])],
  providers: [ProfileAddressesService],
  controllers: [ProfileAddressesController]
})
export class ProfileAddressesModule {}
