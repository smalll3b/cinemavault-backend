import { Router } from 'express';
import { ReviewController } from '../controllers';
import { validateRequest } from '../validators/middleware';
import { reviewSchemas } from '../validators/schemas';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = Router();
const reviewController = new ReviewController();

// Public routes
router.get('/movie/:movieId', optionalAuth, (req, res) => reviewController.getMovieReviews(req, res));

// Protected routes
router.post('/', authenticateToken, validateRequest(reviewSchemas.create), (req, res) =>
  reviewController.createReview(req, res)
);

router.get('/user/reviews', authenticateToken, (req, res) => reviewController.getUserReviews(req, res));

router.put('/:id', authenticateToken, validateRequest(reviewSchemas.update), (req, res) =>
  reviewController.updateReview(req, res)
);

router.delete('/:id', authenticateToken, (req, res) => reviewController.deleteReview(req, res));

export default router;

