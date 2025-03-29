import { validateEmail, validatePassword, validateBodyStructure} from './helpers';
import { AppError } from '../errors/AppError';

export function validateLoginInput(data: any) {
  const body = validateBodyStructure(data)
  const { email, password } = body;

  return {
    email: validateEmail(email),
    password: validatePassword(password),
  };
}

export function validateRefreshTokenInput(data: unknown): { refreshToken: string } {
  const body = validateBodyStructure(data);

  if (typeof body.refreshToken !== 'string' || body.refreshToken.trim() === '') {
    throw new AppError('Refresh token is required', 400);
  }

  return { refreshToken: body.refreshToken };
}