import { Router } from 'express';
import { RatingController } from '../controllers';
import { validateRequest } from '../validators/middleware';
import { ratingSchemas } from '../validators/schemas';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = Router();
const ratingController = new RatingController();

// Public route
router.get('/:movieId', optionalAuth, (req, res) => ratingController.getMovieRatings(req, res));

// Protected routes
router.post('/', authenticateToken, validateRequest(ratingSchemas.create), (req, res) =>
  ratingController.createRating(req, res)
);

router.put('/:id', authenticateToken, validateRequest(ratingSchemas.update), (req, res) =>
  ratingController.updateRating(req, res)
);

router.delete('/:id', authenticateToken, (req, res) => ratingController.deleteRating(req, res));

export default router;

