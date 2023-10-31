import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle("Challeniz API")
    .setDescription("The is a sample Challeniz API")
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      name: 'JWT',
      in: 'header',
    }, 'access-token')
    .build();
  
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document, { swaggerOptions: { defaultModelsExpandDepth: -1 }});

  app.enableCors();
  await app.listen(3006);
}
bootstrap();
