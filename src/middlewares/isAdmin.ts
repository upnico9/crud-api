import { FastifyRequest, FastifyReply } from 'fastify';

export async function isAdmin(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user;

  if (!user || user.role !== 'ADMIN') {
    return reply.code(403).send({ error: 'Access denied: ADMIN only' });
  }
}
