const Availability = require('../models/Availability');

// @route GET /api/availability
// Public - filter by providerId and/or date, only shows unbooked slots unless includeBooked=true
exports.getAvailability = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.providerId) filter.providerId = req.query.providerId;
    if (req.query.date) filter.date = req.query.date;
    if (req.query.includeBooked !== 'true') filter.isBooked = false;

    const slots = await Availability.find(filter).sort({ date: 1, startTime: 1 });
    res.status(200).json(slots);
  } catch (err) {
    next(err);
  }
};

// @route POST /api/availability
// Provider only
exports.createAvailability = async (req, res, next) => {
  try {
    const { date, startTime, endTime } = req.body;

    if (!date || !startTime || !endTime) {
      return res.status(400).json({ message: 'Date, startTime and endTime are required' });
    }

    if (startTime >= endTime) {
      return res.status(400).json({ message: 'startTime must be before endTime' });
    }

    const slot = await Availability.create({
      providerId: req.user._id,
      date,
      startTime,
      endTime
    });

    res.status(201).json(slot);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'This slot already exists' });
    }
    next(err);
  }
};

// @route DELETE /api/availability/:id
// Provider only, must own the slot, cannot delete a booked slot
exports.deleteAvailability = async (req, res, next) => {
  try {
    const slot = await Availability.findById(req.params.id);
    if (!slot) {
      return res.status(404).json({ message: 'Slot not found' });
    }

    if (slot.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not own this slot' });
    }

    if (slot.isBooked) {
      return res.status(400).json({ message: 'Cannot delete a slot that is already booked' });
    }

    await slot.deleteOne();
    res.status(200).json({ message: 'Slot deleted successfully' });
  } catch (err) {
    next(err);
  }
};
