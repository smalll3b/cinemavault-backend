import { Router } from 'express';
import { AuthController } from '../controllers';
import { validateRequest } from '../validators/middleware';
import { authSchemas } from '../validators/schemas';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', validateRequest(authSchemas.register), (req, res) => authController.register(req, res));

router.post('/login', validateRequest(authSchemas.login), (req, res) => authController.login(req, res));

// Protected routes
router.get('/profile', authenticateToken, (req, res) => authController.getProfile(req, res));

export default router;

