import { FastifyRequest, FastifyReply } from 'fastify';
import { createUser, findUserById, updateUser, deleteUser, findUsersPaginated} from '../models/userModel';
import { validateCreateUser, validateDeleteUser, validateUpdateUser } from '../validators/userValidators';
import { hashPassword } from '../services/hashService';
import { sendWelcomeEmail } from '../services/emailService';
import { AppError } from '../errors/AppError';

export async function createUserController(req: FastifyRequest, reply: FastifyReply) {
    const { firstName, lastName, email, password, role } = req.body as any;
    const currentUser = (req as any).user;

    if (currentUser.role !== 'ADMIN') {
      throw new AppError('Only admin can create users', 403)
    }

    await validateCreateUser({firstName, lastName, email, password})

    const passwordHash = await hashPassword(password);
    const user = await createUser({ firstName, lastName, email, passwordHash, role });

    try {
      await sendWelcomeEmail(user.email);
    } catch (error: any) {
      req.log.warn({ err: error }, 'Failed to send welcome email');
    }
    reply.status(201).send(user);
}

export async function getUsersController(req: FastifyRequest, reply: FastifyReply) {
  const { page = 1, limit = 10, search, sortBy, order } = req.query as any;
  const safeLimit = Math.min(Number(limit), 100);

  const result = await findUsersPaginated(
    Number(page),
    Number(safeLimit),
    search,
    sortBy,
    order
  );
  reply.send(result);
}


export async function getUserByIdController(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as { id: string };

  const user = await findUserById(id);
  if (!user) {
    return reply.code(404).send({ error: 'User not found' });
  }

  reply.send(user);
}

export async function updateUserController(req: FastifyRequest, reply: FastifyReply) {
  try {
    const { id } = req.params as { id: string };
    const currentUser = (req as any).user;

    const updateData = await validateUpdateUser(currentUser, id, req.body);

    const updated = await updateUser(id, updateData);
    reply.send(updated);
  } catch (error: any) {
    reply.status(error.statusCode || 400).send({ error: error.message });
  }
}

export async function deleteUserController(req: FastifyRequest, reply: FastifyReply) {
  const { id } = req.params as { id: string };
  const currentUser = (req as any).user;

  await validateDeleteUser(currentUser, id);
  const deleted = await deleteUser(id);
  reply.send({ message: `User ${deleted.email} deleted.` });
}

