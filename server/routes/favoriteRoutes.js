import express from 'express';
import { getFavorites, addFavorite, removeFavorite } from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';
import { param, body, validationResult } from 'express-validator';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

router.use(protect);

router.get('/', getFavorites);

router.post('/', [
  body('city').trim().notEmpty().withMessage('City is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('lat').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('lon').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  validate
], addFavorite);

router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid favorite ID'),
  validate
], removeFavorite);

export default router;