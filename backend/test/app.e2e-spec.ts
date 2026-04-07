import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  Injectable,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppController } from './../src/app.controller';
import { AppService } from './../src/app.service';
import { AuthController } from './../src/auth/auth.controller';
import { AuthService } from './../src/auth/auth.service';
import { JwtAuthGuard } from './../src/auth/guards/jwt-auth.guard';
import { TasksController } from './../src/tasks/tasks.controller';
import { TasksService } from './../src/tasks/tasks.service';

const authenticatedUser = {
  id: 1,
  name: 'Arturo',
  email: 'arturo@arturo.com',
};

@Injectable()
class TestJwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      headers: { authorization?: string };
      user?: typeof authenticatedUser;
    }>();
    const authHeader = request.headers.authorization;

    if (authHeader !== 'Bearer test-token') {
      throw new UnauthorizedException();
    }

    request.user = authenticatedUser;

    return true;
  }
}

describe('Backend API (e2e)', () => {
  let app: INestApplication;

  const authServiceMock = {
    register: jest.fn(),
    login: jest.fn(),
  };

  const tasksServiceMock = {
    findAllByUser: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    softDelete: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController, AuthController, TasksController],
      providers: [
        AppService,
        {
          provide: AuthService,
          useValue: authServiceMock,
        },
        {
          provide: TasksService,
          useValue: tasksServiceMock,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useClass(TestJwtAuthGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/register should register a user', async () => {
    const registerPayload = {
      name: 'Arturo',
      email: 'arturo@arturo.com',
      password: '123456789',
    };
    const registerResponse = {
      accessToken: 'jwt-token',
      user: authenticatedUser,
    };

    authServiceMock.register.mockResolvedValue(registerResponse);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(registerPayload)
      .expect(201)
      .expect(registerResponse);

    expect(authServiceMock.register).toHaveBeenCalledWith(registerPayload);
  });

  it('POST /auth/register should validate the request body', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: '',
        email: 'correo-invalido',
        password: '123',
      })
      .expect(400);

    expect(authServiceMock.register).not.toHaveBeenCalled();
  });

  it('GET /tasks should reject requests without token', async () => {
    await request(app.getHttpServer()).get('/tasks').expect(401);

    expect(tasksServiceMock.findAllByUser).not.toHaveBeenCalled();
  });

  it('GET /tasks should allow access with a valid bearer token', async () => {
    const tasksResponse = [
      {
        id: 1,
        title: 'Preparar informe semanal',
        completed: false,
        user_id: authenticatedUser.id,
      },
    ];

    tasksServiceMock.findAllByUser.mockResolvedValue(tasksResponse);

    await request(app.getHttpServer())
      .get('/tasks')
      .set('Authorization', 'Bearer test-token')
      .expect(200)
      .expect(tasksResponse);

    expect(tasksServiceMock.findAllByUser).toHaveBeenCalledWith(
      authenticatedUser,
    );
  });
});
