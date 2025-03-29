import Fastify from 'fastify';
import { userRoutes } from './routes/userRoutes';
import { authRoutes } from './routes/authRoutes';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { errorHandler } from './errors/errorHandler';


export function buildApp() {
  
  const apiPrefix: string = '/api'
  
  const app = Fastify({ logger: true });
  
  app.setErrorHandler(errorHandler);
  
  // Register swagger before routes to avoid swagger emptyness
  app.register(swagger, {
      swagger: {
        info: {
          title: 'CRUD API',
          description: 'API REST avec auth JWT',
          version: '1.0.0',
        },
        securityDefinitions: {
          bearerAuth: {
              type: 'apiKey',
              name: 'Authorization',
              in: 'header',
          },
        },
        security: [{ bearerAuth: [] }],
      },
    });
  app.register(swaggerUi, { routePrefix: '/docs' });
  
  
  app.register(authRoutes, { prefix: apiPrefix });
  app.register(userRoutes, { prefix: apiPrefix });
  

  return app;
};