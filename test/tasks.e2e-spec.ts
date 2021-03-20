import * as exphbs from 'express-handlebars';
import * as jwt from 'jsonwebtoken';
import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from '../src/app.module';
import { TasksModule } from '../src/tasks/tasks.module';

describe('TasksController (e2e)', () => {
  let app: NestExpressApplication;
  let accessToken: string;

  beforeAll(async () => {
    accessToken = jwt.sign(
      {
        iss: process.env.OAUTH2_ISSUER,
        sub: 'mr-end2end@clients',
        aud: process.env.OAUTH2_AUDIENCE,
        iat: Math.floor(Date.now() / 1000 - 60), // Now-60s
        exp: Math.floor(Date.now() / 1000 + 86400), // Now+24h
        azp: 'self.authorized.',
        gty: 'client-credentials',
      },
      process.env.OAUTH2_SIGNING_SECRET,
    );
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TasksModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useStaticAssets(join(__dirname, '..', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'views'));
    app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main' }));
    app.setViewEngine('hbs');
    await app.init();
  });

  describe('@Public: GET /tasks', () => {
    it('returns a HTML page with a tasks overview', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(200)
        .expect('Content-Type', 'text/html; charset=utf-8')
        .then((response) => {
          expect(response.text).toContain(
            '<title>Konfigurator: Bakgrundsjobb</title>',
          );
          expect(response.text).toContain('<h1>Översikt av bakgrundsjobb</h1>');
        });
    });
  });
});
