import { Module } from '@nestjs/common';
import { DateAfterFieldConstrain } from './date-after-field.constrain';
import { ExistsConstrain } from './exists.constrain';
import { IsUniqueConstrain } from './is-unique.constrain';
import { MimeTypeConstrain } from './mime-type.constrain';

@Module({
  providers: [IsUniqueConstrain, ExistsConstrain, MimeTypeConstrain, DateAfterFieldConstrain],
})
export class ValidationModule {}
