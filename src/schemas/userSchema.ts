export const userBaseProperties = {
  id: { type: 'string' },
  firstName: { type: 'string' },
  lastName: { type: 'string' },
  email: { type: 'string' },
  role: { type: 'string', enum: ['USER', 'ADMIN'] },
  createdAt: { type: 'string', format: 'date-time' },
};

export const createUserBodySchema = {
  type: 'object',
  required: ['firstName', 'lastName', 'email', 'password', 'role'],
  additionalProperties: false,
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
    role: { type: 'string', enum: ['USER', 'ADMIN'] },
  },
};

export const updateUserBodySchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
    role: { type: 'string', enum: ['USER', 'ADMIN'] },
  },
};

export const userResponseSchema = {
  type: 'object',
  properties: userBaseProperties,
};

export const usersListResponseSchema = {
  type: 'array',
  items: userResponseSchema,
};

export const paginatedUsersResponseSchema = {
  type: 'object',
  properties: {
    data: usersListResponseSchema,
    pagination: {
      type: 'object',
      properties: {
        total: { type: 'number' },
        page: { type: 'number' },
        limit: { type: 'number' },
        totalPages: { type: 'number' },
      },
    },
  },
};