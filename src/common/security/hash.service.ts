import { Injectable } from "@nestjs/common";
import { hash, compare } from "bcrypt";

@Injectable()
export class HashService {
  private readonly saltRounds = 10
  async hash(plainText: string): Promise<string> {
    return await hash(plainText, this.saltRounds)
  }
  async compare(plainText: string, hashed: string): Promise<boolean> {
    return await compare(plainText, hashed)
  }
}