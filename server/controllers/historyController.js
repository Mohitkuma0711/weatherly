import SearchHistory from '../models/SearchHistory.js';

export const getHistory = async (req, res, next) => {
  try {
    const history = await SearchHistory.find({ userId: req.user._id })
      .sort({ searchedAt: -1 })
      .limit(20)
      .lean();

    res.json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

export const addHistory = async (req, res, next) => {
  try {
    const { city, country, temperature, weatherCondition, weatherIcon } = req.body;

    const history = await SearchHistory.create({
      userId: req.user._id,
      city,
      country,
      temperature,
      weatherCondition,
      weatherIcon
    });

    res.status(201).json({ success: true, data: history });
  } catch (error) {
    next(error);
  }
};

export const deleteHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const history = await SearchHistory.findOneAndDelete({ _id: id, userId: req.user._id });

    if (!history) {
      return res.status(404).json({ success: false, message: 'History item not found' });
    }

    res.json({ success: true, message: 'History item deleted' });
  } catch (error) {
    next(error);
  }
};

export const clearHistory = async (req, res, next) => {
  try {
    await SearchHistory.deleteMany({ userId: req.user._id });
    res.json({ success: true, message: 'History cleared' });
  } catch (error) {
    next(error);
  }
};