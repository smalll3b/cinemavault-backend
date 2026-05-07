import { Router } from 'express';
import { MovieController } from '../controllers';
import { validateRequest, validateQuery } from '../validators/middleware';
import { movieSchemas } from '../validators/schemas';
import { authenticateToken, optionalAuth } from '../middleware/auth';

const router = Router();
const movieController = new MovieController();

// Public routes
router.get('/', optionalAuth, (req, res) => movieController.getAllMovies(req, res));

router.get('/search', validateQuery(movieSchemas.search), (req, res) => movieController.searchMovies(req, res));

router.get('/:id', (req, res) => movieController.getMovieById(req, res));

// Protected routes - require authentication
router.post('/', authenticateToken, validateRequest(movieSchemas.create), (req, res) =>
  movieController.createMovie(req, res)
);

router.post('/omdb/create', authenticateToken, validateRequest(movieSchemas.create), (req, res) =>
  movieController.createMovieFromOMDB(req, res)
);

router.put('/:id', authenticateToken, validateRequest(movieSchemas.update), (req, res) =>
  movieController.updateMovie(req, res)
);

router.delete('/:id', authenticateToken, (req, res) => movieController.deleteMovie(req, res));

export default router;

