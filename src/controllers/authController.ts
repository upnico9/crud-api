import { FastifyRequest, FastifyReply } from 'fastify';
import { findUserByEmail, findUserById } from '../models/userModel';
import { verifyPassword } from '../services/hashService';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../services/jwtService';
import { validateLoginInput, validateRefreshTokenInput } from "../validators/authValidators";

export async function loginController(req: FastifyRequest, reply: FastifyReply) {
  const { email, password } = validateLoginInput(req.body)

  const user = await findUserByEmail(email);

  if (!user) return reply.code(401).send({ error: 'Invalid credentials' });

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return reply.code(401).send({ error: 'Invalid credentials' });

  const accessToken = signAccessToken({ sub: user.id, role: user.role });
  const refreshToken = signRefreshToken({ sub: user.id, role: user.role });

  reply.send({accessToken: accessToken, refreshToken: refreshToken });
}

export async function refreshTokenController(req: FastifyRequest, reply: FastifyReply) {
  const { refreshToken } = validateRefreshTokenInput(req.body);

  if (!refreshToken) {
    return reply.code(400).send({ error: 'Missing refresh token' });
  }

  const payload = verifyRefreshToken(refreshToken) as any;

  const user = await findUserById(payload.sub);

  if (!user) {
    return reply.code(401).send({ error: 'User no longer exists' });
  }

  if (user.role !== payload.role) {
    return reply.code(401).send({ error: 'Token role is outdated' });
  }

  const newAccessToken = signAccessToken({ sub: payload.sub, role: payload.role });
  reply.send({ accessToken: newAccessToken });
}



