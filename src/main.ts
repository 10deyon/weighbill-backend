import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import * as rateLimit from 'express-rate-limit';
import * as compression from 'compression';
import config from './core/config/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import { AppModule } from './app.module';
import useSwaggerUIAuthStoragePlugin from './shared/utils/swagger-pluggin';
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {
    const SWAGGER_ENVS = ['development', 'staging'];

    const CONFIG = config();

    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.setGlobalPrefix('api/v1');

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        }),
    );

    app.enableCors();

    const configuration = new DocumentBuilder()
        .setTitle('MYWAYBILLAFRICA Endpoints')
        .setDescription('MYWAYBILLAFRICA API documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('MYWAYBILLAFRICA')
        .setExternalDoc('Postman Collection', '/api-json')
        .build();

    const document = SwaggerModule.createDocument(app, configuration);
    SwaggerModule.setup('/api', app, document);

    app.use(compression());
    app.use(helmet());
    app.use(
        rateLimit({
            windowMs: 1000,
            max: 6000 /*10000*/, // limit each IP to 100 requests per windowMs
        }),
    );

    // if (SWAGGER_ENVS.includes(CONFIG.APP_ENV)) {
    //     app.use(['/api'], basicAuth({
    //         challenge: true,
    //         users: {
    //             [CONFIG.SWAGGER_USER]: CONFIG.SWAGGER_PASSWORD
    //         },
    //     }))

    // const configuration = new DocumentBuilder()
    //     .setTitle('MYWAYBILLAFRICA Endpoints')
    //     .setDescription('MYWAYBILLAFRICA API documentation')
    //     .setVersion('1.0')
    //     .addBearerAuth()
    //     .addTag('MYWAYBILLAFRICA')
    //     .setExternalDoc('Postman Collection', '/api-json')
    //     .build();

    // const document = SwaggerModule.createDocument(app, configuration);
    // SwaggerModule.setup('/api', app, document);
    // }

    // const options = new DocumentBuilder()
    //     .setTitle('MYWAYBILLAFRICA Endpoints')
    //     .setDescription('MYWAYBILLAFRICA API documentation')
    //     .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' })
    //     .setVersion('0.1')
    //     .build();

    // const document = SwaggerModule.createDocument(app, options);

    // SwaggerModule.setup('api/docs', app, document, {
    //     swaggerOptions: {
    //         docExpansion: 'none',
    //         plugins: [useSwaggerUIAuthStoragePlugin()],
    //     },
    // });

    await app.listen(CONFIG.APP_PORT, () => {
        console.log(`server started listening on port ${CONFIG.APP_PORT}`);
    });
}

bootstrap();
