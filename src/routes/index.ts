import { Router } from 'express';
import authRoutes from './auth';
import movieRoutes from './movies';
import watchlistRoutes from './watchlist';
import ratingRoutes from './ratings';
import reviewRoutes from './reviews';

const router = Router();

router.use('/auth', authRoutes);
router.use('/movies', movieRoutes);
router.use('/watchlist', watchlistRoutes);
router.use('/ratings', ratingRoutes);
router.use('/reviews', reviewRoutes);

export default router;

