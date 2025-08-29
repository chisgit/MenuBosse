import { app } from '../../server/index';
import serverless from 'serverless-http';

export const handler = serverless(app);
