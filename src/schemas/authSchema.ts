import { responses } from './commonSchema';

export const loginRequestSchema = {
  type: 'object',
  required: ['email', 'password'],
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
  },
};

export const loginResponseSchema = {
  type: 'object',
  properties: {
    accessToken: { type: 'string' },
    refreshToken: { type: 'string' },
  },
};

export const refreshTokenRequestSchema = {
  type: 'object',
  required: ['refreshToken'],
  additionalProperties: false,
  properties: {
    refreshToken: { type: 'string' },
  },
};

export const refreshTokenResponseSchema = {
  type: 'object',
  properties: {
    accessToken: { type: 'string' },
  },
};
