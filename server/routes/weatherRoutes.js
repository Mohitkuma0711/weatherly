import express from 'express';
import { getWeatherByCity, getWeatherByCoords } from '../controllers/weatherController.js';
import { query, validationResult } from 'express-validator';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
};

router.get('/', [
  query('city').optional().trim().notEmpty().withMessage('City name is required'),
  query('lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  query('lon').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  validate
], async (req, res, next) => {
  if (req.query.city) {
    return getWeatherByCity(req, res, next);
  }
  if (req.query.lat && req.query.lon) {
    return getWeatherByCoords(req, res, next);
  }
  return res.status(400).json({ success: false, message: 'City or coordinates required' });
});

export default router;