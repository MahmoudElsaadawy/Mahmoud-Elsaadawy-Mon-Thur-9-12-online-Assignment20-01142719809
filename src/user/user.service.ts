import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { createOtp } from '../common/Email/createEmail.js';
import { generateOtpHtml } from '../common/Email/html.otp.template.js';
import { sendEmail } from '../common/Email/sendEmail.js';
import { User } from '../common/models/user.model.js';
import { signupKey } from '../common/redis/redis.service.js';
import { HashService } from '../common/security/hash.service.js';
import { signupDTO } from './DTO/createUser.dto.js';
import { confirmEmailDTO } from './user.validation.js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    private readonly hashService: HashService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(body: signupDTO) {
    const isEmailExist = await this.userModel.findOne({
      email: body.email,
    });

    if (isEmailExist) {
      throw new BadRequestException('this email already exists');
    }

    const user = await this.userModel.create(body);
    const otp = createOtp();
    await this.cacheManager.set(signupKey(user.id), otp, 5 * 60 * 1000);
    sendEmail({
      to: user.email,
      subject: 'Confirm your email',
      html: generateOtpHtml(user.name, otp),
    });
    return {
      data: {
        user,
      },
    };
  }

  async confirmEmail(body: confirmEmailDTO) {
    const user = await this.userModel.findOne({
      email: body.email,
      confirmedAt: {
        $exists: false,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const otp = await this.cacheManager.get(signupKey(user.id));
    if (!otp || otp != body.otp) {
      throw new BadRequestException('Invalid or expited OTP');
    }
    user.confirmedAt = new Date(Date.now());
    await this.cacheManager.del(signupKey(user.id));
    await user.save();
    return {
      data: {},
    };
  }

  async login(body: any) {
    const user = await this.userModel.findOne({
      email: body.email,
      confirmedAt: {
        $exists: true,
      },
    });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    if (!await this.hashService.compare(body.password, user.password)) {
      throw new BadRequestException('Invalid credentials');
    }

    const accessToken = await this.jwtService.signAsync({
      email: user.email,
      _id: user._id,
    }, {
      secret: this.configService.get<string>("TOKEN_SECERT"),
      expiresIn: "30Min"
    })
    return {accessToken}
  }

  async getAll() {
    return await this.userModel.find();
  }
}
