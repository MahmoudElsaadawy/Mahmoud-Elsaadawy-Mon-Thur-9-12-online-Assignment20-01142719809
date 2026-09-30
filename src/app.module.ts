import { Logger, Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './user/user.module.js';
import { PostModule } from './post/post.module.js';
import { ChatModule } from './chat/app.module.js';
import { MessageController } from './message/message.controller.js';
import { MessageService } from './message/message.service.js';
import { MessageModule } from './message/message.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SecurityModule } from './common/security/security.module.js';
import { HashService } from './common/security/hash.service.js';
import { EncService } from './common/security/encryption.service.js';
import { buildSchema } from './common/models/user.model.js';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from "@keyv/redis"

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    UserModule,
    PostModule,
    ChatModule,
    MessageModule,
    ConfigModule.forRoot({
      envFilePath: './config/.env',
      isGlobal: true,
      // validationSchema: Joi.object({
      //   PORT: Joi.number().required(),
      //   DB_URL: Joi.string().required()
      // })
    }),
    SecurityModule,
    // MongooseModule.forRoot(process.env.DB_URI as string, {
    //   onConnectionCreate: (connection)=> {
    //     connection.on("connected", ()=> {Logger.log("DB Connected successfully")})
    //   },
    //   serverSelectionTimeoutMS: 3000
    // }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule, SecurityModule],
      inject: [ConfigService, HashService, EncService],
      useFactory: (
        configService: ConfigService,
        hashService: HashService,
        encService: EncService,
      ) => {
        buildSchema(hashService, encService);
        return {
          uri: configService.get<string>('DB_URI'),
          onConnectionCreate: (connection) => {
            connection.on('connected', () => {
              Logger.log('DB Connected successfully');
            });
            return connection;
          },
          serverSelectionTimeoutMS: 3000,
        };
      },
    }),
    SecurityModule,
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          stores: [createKeyv('redis://127.0.0.1:6379')],
        };
      },
    }),
  ],
  controllers: [AppController, MessageController],
  providers: [AppService, MessageService],
})
export class AppModule {}
