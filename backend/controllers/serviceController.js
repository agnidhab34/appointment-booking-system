const Service = require('../models/Service');

// @route GET /api/services
// Public - list all services, optionally filter by providerId
exports.getServices = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.providerId) filter.providerId = req.query.providerId;

    const services = await Service.find(filter).populate('providerId', 'name email');
    res.status(200).json(services);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/services/:id
exports.getServiceById = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id).populate('providerId', 'name email');
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.status(200).json(service);
  } catch (err) {
    next(err);
  }
};

// @route POST /api/services
// Provider only
exports.createService = async (req, res, next) => {
  try {
    const { name, description, duration, price } = req.body;

    if (!name || !duration || price === undefined) {
      return res.status(400).json({ message: 'Name, duration and price are required' });
    }

    const service = await Service.create({
      providerId: req.user._id,
      name,
      description,
      duration,
      price
    });

    res.status(201).json(service);
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/services/:id
// Provider only, must own the service
exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not own this service' });
    }

    const { name, description, duration, price } = req.body;
    if (name !== undefined) service.name = name;
    if (description !== undefined) service.description = description;
    if (duration !== undefined) service.duration = duration;
    if (price !== undefined) service.price = price;

    await service.save();
    res.status(200).json(service);
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/services/:id
// Provider only, must own the service
exports.deleteService = async (req, res, next) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.providerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You do not own this service' });
    }

    await service.deleteOne();
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (err) {
    next(err);
  }
};
