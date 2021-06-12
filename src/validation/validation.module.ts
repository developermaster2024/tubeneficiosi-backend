import { Module } from '@nestjs/common';
import { ExistsConstrain } from './exists.constrain';
import { IsUniqueConstrain } from './is-unique.constrain';
import { MimeTypeConstrain } from './mime-type.constrain';

@Module({
  providers: [IsUniqueConstrain, ExistsConstrain, MimeTypeConstrain]
})
export class ValidationModule {}
