import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { diskStorage } from 'multer';
import { Store } from 'src/stores/entities/store.entity';
import { filenameGenerator } from 'src/support/file-uploads';
import { Place } from './entities/place.entity';
import { Zone } from './entities/zone.entity';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Place, Store, Zone]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/places',
        filename: filenameGenerator,
      })
    }),
  ],
  controllers: [PlacesController],
  providers: [PlacesService]
})
export class PlacesModule {}
