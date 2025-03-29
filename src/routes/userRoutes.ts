import { FastifyInstance } from 'fastify';
import {
  createUserController,
  getUsersController,
  getUserByIdController,
  updateUserController,
  deleteUserController
} from '../controllers/userController';

import {
  createUserBodySchema,
  updateUserBodySchema,
  userResponseSchema,
  paginatedUsersResponseSchema
} from '../schemas/userSchema';

import {
  idParamSchema,
  responses,
  paginationQuerySchema,
} from '../schemas/commonSchema';

import { verifyAuth } from '../middlewares/authMiddleware';
import { isAdmin } from '../middlewares/isAdmin';
import { isOwnerOrAdmin } from '../middlewares/isOwnerOrAdmin';

export async function userRoutes(app: FastifyInstance) {
  app.post('/users', {
    preHandler: [verifyAuth, isAdmin],
    schema: {
      tags: ['User'],
      description: 'Create a new user',
      body: createUserBodySchema,
      response: {
        201: userResponseSchema,
        400: responses[400],
        409: responses[409],
      },
    }
  }, createUserController);

  app.get('/users', {
    preHandler: [verifyAuth, isAdmin],
    schema: {
      tags: ['User'],
      description: 'Lister tous les utilisateurs (ADMIN uniquement)',
      querystring: paginationQuerySchema,
      security: [{ bearerAuth: [] }],
      response: {
        200: paginatedUsersResponseSchema,
      },
    },
  }, getUsersController);

  app.get('/users/:id', {
    preHandler: [verifyAuth, isOwnerOrAdmin],
    schema: {
      tags: ['User'],
      description: 'Récupérer un utilisateur par ID (admin ou propriétaire)',
      security: [{ bearerAuth: [] }],
      params: idParamSchema,
      response: {
        200: userResponseSchema,
        404: responses[404],
      },
    },
  }, getUserByIdController);

  app.patch('/users/:id', {
    preHandler: [verifyAuth, isOwnerOrAdmin],
    schema: {
      tags: ['User'],
      description: 'Met à jour un utilisateur (propriétaire ou admin)',
      security: [{ bearerAuth: [] }],
      params: idParamSchema,
      body: updateUserBodySchema,
      response: {
        200: userResponseSchema,
        400: responses[400],
        403: responses[403],
        404: responses[404],
      },
    },
  }, updateUserController);

  app.delete('/users/:id', {
    preHandler: [verifyAuth, isOwnerOrAdmin],
    schema: {
      tags: ['User'],
      description: 'Supprime un utilisateur (Owner ou admin)',
      security: [{ bearerAuth: [] }],
      params: idParamSchema,
      response: {
        200: responses[200],
        404: responses[404],
        500: responses[500],
      },
    },
  }, deleteUserController);
}
