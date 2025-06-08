import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { doubleCsrf } from 'csrf-csrf';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './commons/interceptors/logging.interceptor';
import helmet from 'helmet';
//logging
import { Logger } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';
import { SeedService } from './modules/database/seed.service';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  app.use(helmet());
  //security
  // const {
  //   doubleCsrfProtection, // This is the default CSRF protection middleware.
  // } = doubleCsrf({
  //   getSecret: () => 'Secret', // A function that optionally takes the request and returns a secret
  //   // eslint-disable-next-line @typescript-eslint/no-unused-vars
  //   getSessionIdentifier: (req) => '', // A function that should return the session identifier for a given request
  //   cookieName: '__Host-psifi.x-csrf-token', // The name of the cookie to be used, recommend using Host prefix.
  //   cookieOptions: {
  //     sameSite: 'strict',
  //     path: '/',
  //     secure: true,
  //   },
  //   size: 64, // The size of the generated tokens in bits
  //   ignoredMethods: ['GET', 'HEAD', 'OPTIONS'], // A list of request methods that will not be protected.
  //   getTokenFromRequest: (req) => req.headers['x-csrf-token'], // A function that returns the token from the request
  // });
  // app.use(doubleCsrfProtection);
  // Global validation pipe
 
//TODO: USE IN PROD
//app.enableCors({origin:'https://djiguiya.sankaretech.com', });
app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Run database seed
  const seedService = app.get(SeedService);
  await seedService.onModuleInit();

  const config = new DocumentBuilder()
    .setTitle('Djiguiya Health Cards API')
    .setDescription(
      'Comprehensive API documentation for the Djiguiya Health Cards system',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  const logger = new Logger('Bootstrap');
  logger.log(`Application is running on http://localhost:${PORT}`);
}
bootstrap();
