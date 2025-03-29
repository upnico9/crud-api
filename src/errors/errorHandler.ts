import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { AppError } from './AppError';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  const log = `[${request.method}] ${request.url}`;
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return reply.status(400).send({ error: 'Unique constraint failed (e.g. email already in use)' });
      case 'P2025':
        return reply.status(404).send({ error: 'Record not found' });
      case 'P2003':
        return reply.status(400).send({ error: 'Invalid foreign key reference' });
      default:
        console.error(`Prisma error @ ${log}:`, error);
        return reply.status(400).send({ error: 'Database error' });
    }
  }

  if (error instanceof jwt.JsonWebTokenError) {
    return reply.status(401).send({ error: 'Invalid token' });
  }

  if (error instanceof jwt.TokenExpiredError) {
    return reply.status(401).send({ error: 'Token expired' });
  }

  if (error instanceof jwt.NotBeforeError) {
    return reply.status(401).send({ error: 'Token not active yet' });
  }

  if ((error as any).validation) {
    return reply.status(400).send({
      error: 'Invalid input',
      details: (error as any).validation,
    });
  }
  
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({error: error.message})
  }


  console.error(`Unhandled error @ ${log}:`, error);
  console.log(error)

  return reply.status(500).send({
    error: 'Internal server error',
  });
}
