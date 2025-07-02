import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Login API',
            version: '1.0.0',
            description: 'API documentation for User Login system',
        },
        servers: [
            {
                url: 'http://localhost:3000/api',
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            responses: {
                UnauthorizedError: {
                    description: 'Authentication failed',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: false
                                    },
                                    notifications: {
                                        type: 'object',
                                        properties: {
                                            auth: {
                                                type: 'array',
                                                items: {
                                                    type: 'string'
                                                },
                                                example: ['Authorization header is missing']
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                ForbiddenError: {
                    description: 'Access forbidden',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    success: {
                                        type: 'boolean',
                                        example: false
                                    },
                                    notifications: {
                                        type: 'object',
                                        properties: {
                                            auth: {
                                                type: 'array',
                                                items: {
                                                    type: 'string'
                                                },
                                                example: ['User does not have the required role']
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        './src/modules/auth/*.ts',
        './src/modules/users/*.ts',
        './src/modules/roles/*.ts',
    ],
};

export const swaggerSpec = swaggerJsdoc(options); 