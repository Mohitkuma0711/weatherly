import Favorite from '../models/Favorite.js';

export const getFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ userId: req.user._id })
      .sort({ addedAt: -1 })
      .lean();

    res.json({ success: true, data: favorites });
  } catch (error) {
    next(error);
  }
};

export const addFavorite = async (req, res, next) => {
  try {
    const { city, country, lat, lon } = req.body;

    if (!city || !country || lat === undefined || lon === undefined) {
      return res.status(400).json({ success: false, message: 'City, country, lat, and lon are required' });
    }

    const favorite = await Favorite.create({
      userId: req.user._id,
      city,
      country,
      lat,
      lon
    });

    res.status(201).json({ success: true, data: favorite });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'City already in favorites' });
    }
    next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const { id } = req.params;

    const favorite = await Favorite.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!favorite) {
      return res.status(404).json({ success: false, message: 'Favorite not found' });
    }

    res.json({ success: true, message: 'Favorite removed' });
  } catch (error) {
    next(error);
  }
};