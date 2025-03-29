  export const idParamSchema = {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
      },
      required: ['id'],
    };

    export const responseMessage = {
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    };
    
    export const errorResponse = {
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    };
    
    export const paginationQuerySchema = {
      type: 'object',
      properties: {
        page: { type: 'integer', minimum: 1, default: 1 },
        limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
        search: { type: 'string' },
        sortBy: {
          type: 'string',
          enum: ['firstName', 'lastName', 'email', 'createdAt'],
          default: 'createdAt',
        },
        order: {
          type: 'string',
          enum: ['asc', 'desc'],
          default: 'desc',
        },
      },
    };
    
    
    export const responses = {
      200: responseMessage,
      201: responseMessage,
      400: errorResponse,
      401: errorResponse,
      403: errorResponse,
      404: errorResponse,
      409: errorResponse,
      500: errorResponse,
    };
    