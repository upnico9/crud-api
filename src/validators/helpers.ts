import { AppError } from '../errors/AppError';

export function validateEmail(email: unknown): string {
  if (typeof email !== 'string' || email.trim() === '') {
    throw new AppError('Email is required', 400);
  }

  const normalized = email.toLocaleLowerCase();

  const emailRegex = /^[\w-.]+@[\w-]+\.[a-z]{2,}$/i;
  if (!emailRegex.test(normalized)) {
    throw new AppError('Email is invalid', 400);
  }

  return normalized;
}

export function validatePassword(password: unknown): string {
  if (typeof password !== 'string' || password.trim() === '') {
    throw new AppError('Password is required', 400);
  }

  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
  }

  return password;
}

export function validateBodyStructure(data: unknown): Record<string, any> {
  if (!data || typeof data !== 'object' || Array.isArray(data) || Object.keys(data).length === 0) {
    throw new AppError('Invalid request body', 400);
  }

  return data as Record<string, any>;
}