import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

@Injectable()
export class EncService {
  private readonly algorithm = 'aes-256-gcm';
  private readonly key: Buffer;

  constructor(private readonly configService: ConfigService) {
    const rawKey = this.configService
      .getOrThrow<string>('ENCRYPTION_KEY')
      .trim()
      .replace(/^['"]|['"]$/g, '');

    this.key = /^[0-9a-fA-F]{64}$/.test(rawKey)
      ? Buffer.from(rawKey, 'hex')
      : createHash('sha256').update(rawKey).digest();
  }

  encrypt(plainText: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv(this.algorithm, this.key, iv);
  
    const encrypted = Buffer.concat([
      cipher.update(plainText, "utf-8"),
      cipher.final()
    ])

    const authTag = cipher.getAuthTag()
    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`
  }

  decrypt(payload: string) {
    const parts = payload.split(":")
    if(parts.length != 3){
      throw new BadRequestException("invlaid encryption payload")
    }

    const [iv, authTag, encrypted] = parts.map(ele=> Buffer.from(ele, "hex"))

    try{
      const decipher = createDecipheriv(this.algorithm, this.key, iv)
      decipher.setAuthTag(authTag)
      
      return Buffer.concat([
        decipher.update(encrypted),
        decipher.final()
      ]).toString("utf-8")
    }catch(e){
      throw new BadRequestException("decryption failed: wrong key inserted")
    }
  }
}
