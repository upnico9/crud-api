import { findUserByEmail, findUserById } from '../models/userModel';
import { AppError } from '../errors/AppError';
import { validateBodyStructure, validateEmail, validatePassword } from './helpers';
import { hashPassword } from '../services/hashService';

export async function validateCreateUser(data: any) {
  const body = validateBodyStructure(data)
  const { firstName, lastName, email, password, role } = body;

  if (!firstName || typeof firstName !== 'string') {
    throw new AppError('First name is required', 400);
  }

  if (!lastName || typeof lastName !== 'string') {
    throw new AppError('Last name is required', 400);
  }

  const validEmail = validateEmail(email);
  const validPassword = validatePassword(password);

  const existing = await findUserByEmail(validEmail);
  if (existing) {
    throw new AppError('Email already in use', 409);
  }

  return {
    firstName,
    lastName,
    email: validEmail,
    password: validPassword,
    role,
  };
}

export async function validateUpdateUser(
  currentUser: { sub: string; role: string },
  targetUserId: string,
  data: any
) {
  const body = validateBodyStructure(data);

  if (currentUser.sub !== targetUserId && currentUser.role !== 'ADMIN') {
    throw new AppError('Only admins can modify other users', 403);
  }

  const validated: Record<string, any> = {};

  if ('role' in body) {
    if (currentUser.role !== 'ADMIN') {
      throw new AppError('Only admins can modify roles', 403);
    }
    validated.role = body.role;
  }

  const targetUser = await findUserById(targetUserId);
  if (!targetUser) {
    throw new AppError('User not found', 404);
  }


  if ('email' in body) {
    const validEmail = validateEmail(body.email);
    const existing = await findUserByEmail(validEmail);
    if (existing && existing.id !== targetUserId) {
      throw new AppError('Email already in use', 409);
    }
    validated.email = validEmail;
  }

  if ('firstName' in body) {
    if (typeof body.firstName !== 'string' || !body.firstName.trim()) {
      throw new AppError('Invalid first name', 400);
    }
    validated.firstName = body.firstName;
  }

  if ('lastName' in body) {
    if (typeof body.lastName !== 'string' || !body.lastName.trim()) {
      throw new AppError('Invalid last name', 400);
    }
    validated.lastName = body.lastName;
  }

  if ('password' in body) {
    validatePassword(body.password);
    validated.passwordHash = await hashPassword(body.password);
  }

  return validated;
}


export async function validateDeleteUser(
  currentUser: { sub: string; role: string },
  targetUserId: string
) {
  if (currentUser.role === 'ADMIN' && currentUser.sub === targetUserId) {
    throw new AppError('An admin cannot delete itself', 403);
  }

  const targetUser = await findUserById(targetUserId);
  if (!targetUser) {
    throw new AppError('User not found', 404);
  }
}
