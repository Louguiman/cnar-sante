import { UserPayload } from '../modules/auth/interfaces/user-payload.interface';

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload; // Add the user property
    }
  }
}
