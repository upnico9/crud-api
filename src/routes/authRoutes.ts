import { FastifyInstance } from 'fastify';
import {
  loginController,
  refreshTokenController
} from '../controllers/authController';

import {
  loginRequestSchema,
  loginResponseSchema,
  refreshTokenRequestSchema,
  refreshTokenResponseSchema
} from '../schemas/authSchema';

import { responses } from '../schemas/commonSchema';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/login', {
    schema: {
      tags: ['Auth'],
      description: 'Connexion d’un utilisateur et retour du JWT',
      body: loginRequestSchema,
      response: {
        200: loginResponseSchema,
        400: responses[400],
        401: responses[401],
      },
    },
  }, loginController);

  app.post('/auth/refresh', {
    schema: {
      tags: ['Auth'],
      description: 'Renvoie un nouveau token d’accès à partir d’un refresh token valide',
      body: refreshTokenRequestSchema,
      response: {
        200: refreshTokenResponseSchema,
        400: responses[400],
        401: responses[401],
      },
    },
  }, refreshTokenController);
}
