// src/swagger.ts
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import { swaggerDocs } from './swaggerDocs';

const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};

export default setupSwagger;
