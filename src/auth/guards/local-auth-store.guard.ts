import {Injectable} from '@nestjs/common';
import {AuthGuard} from "@nestjs/passport";

@Injectable()
export class LocalAuthStoreGuard extends AuthGuard('local-store') {}
