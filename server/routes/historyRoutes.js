import express from 'express';
import { getHistory, addHistory, deleteHistory, clearHistory } from '../controllers/historyController.js';
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

router.get('/', getHistory);

router.post('/', [
  body('city').trim().notEmpty().withMessage('City is required'),
  body('country').trim().notEmpty().withMessage('Country is required'),
  body('temperature').isNumeric().withMessage('Temperature is required'),
  body('weatherCondition').trim().notEmpty().withMessage('Weather condition is required'),
  body('weatherIcon').optional().isString(),
  validate
], addHistory);

router.delete('/', clearHistory);

router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid history ID'),
  validate
], deleteHistory);

export default router;