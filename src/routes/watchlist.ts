import { Router } from 'express';
import { WatchlistController } from '../controllers';
import { validateRequest } from '../validators/middleware';
import { watchlistSchemas } from '../validators/schemas';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const watchlistController = new WatchlistController();

// All routes require authentication
router.post('/', authenticateToken, validateRequest(watchlistSchemas.add), (req, res) =>
  watchlistController.addToWatchlist(req, res)
);

router.get('/', authenticateToken, (req, res) => watchlistController.getUserWatchlist(req, res));

router.put('/:id', authenticateToken, validateRequest(watchlistSchemas.update), (req, res) =>
  watchlistController.updateWatchlistStatus(req, res)
);

router.delete('/:id', authenticateToken, (req, res) => watchlistController.removeFromWatchlist(req, res));

export default router;

