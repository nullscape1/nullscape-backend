import { Service } from '../models/Service.js';
import { createCrudControllers } from './crudFactory.js';

export const ServiceController = createCrudControllers(Service);



