import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashingService {
  private saltRounds: number;

  constructor(private configService: ConfigService) {
    this.saltRounds = +this.configService.get<number>('HASH_SALT_ROUNDS', 10);
  }

  async make(plainPassword: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.saltRounds);

    return await bcrypt.hash(plainPassword, salt);
  }

  async check(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}
