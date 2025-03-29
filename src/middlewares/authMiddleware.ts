import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyAccessToken } from '../services/jwtService';

export async function verifyAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return reply.code(401).send({ error: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    (request as any).user = payload;
  } catch (err) {
    return reply.code(401).send({ error: 'Invalid token' });
  }
}
