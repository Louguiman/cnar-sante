import { UserPayload } from './auth/interfaces/user-payload.interface'; // Adjust the path if necessary

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload; // Add the user property
    }
  }
}
