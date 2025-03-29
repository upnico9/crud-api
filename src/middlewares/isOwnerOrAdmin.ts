import { FastifyRequest, FastifyReply } from 'fastify';

export async function isOwnerOrAdmin(request: FastifyRequest, reply: FastifyReply) {
  const user = (request as any).user;
  const paramId = request.params && (request.params as any).id;

  if (!user) {
    return reply.code(401).send({ error: 'Unauthorized' });
  }

  const isOwner = user.sub === paramId;
  const isAdmin = user.role === 'ADMIN';

  if (!isOwner && !isAdmin) {
    return reply.code(403).send({ error: 'Access denied: Not owner or admin' });
  }
}
