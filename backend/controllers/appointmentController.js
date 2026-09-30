const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');
const Service = require('../models/Service');
const User = require('../models/User');

// @route POST /api/appointments
// Customer only
exports.createAppointment = async (req, res, next) => {
  try {
    const { providerId, serviceId, slotId } = req.body;

    if (!providerId || !serviceId || !slotId) {
      return res.status(400).json({ message: 'providerId, serviceId and slotId are required' });
    }

    // 1. Verify provider exists
    const provider = await User.findOne({ _id: providerId, role: 'provider' });
    if (!provider) {
      return res.status(404).json({ message: 'Provider not found' });
    }

    // 2. Verify service exists and belongs to provider
    const service = await Service.findOne({ _id: serviceId, providerId });
    if (!service) {
      return res.status(404).json({ message: 'Service not found for this provider' });
    }

    // 3 & 4. Verify slot exists and is available.
    // findOneAndUpdate is atomic, so this also prevents two customers from
    // booking the same slot at the same time (race condition safe).
    const slot = await Availability.findOneAndUpdate(
      { _id: slotId, providerId, isBooked: false },
      { $set: { isBooked: true } },
      { new: true }
    );

    if (!slot) {
      return res.status(409).json({ message: 'This slot is no longer available' });
    }

    try {
      // 5. Create the appointment
      const appointment = await Appointment.create({
        customerId: req.user._id,
        providerId,
        serviceId,
        slotId,
        date: slot.date,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'pending'
      });

      res.status(201).json(appointment);
    } catch (err) {
      // Roll back the slot if appointment creation fails
      await Availability.findByIdAndUpdate(slotId, { $set: { isBooked: false } });
      throw err;
    }
  } catch (err) {
    next(err);
  }
};

// @route GET /api/appointments
// Returns appointments for the logged-in user (customer sees their bookings,
// provider sees appointments booked with them). Optional ?status= filter.
exports.getAppointments = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === 'customer') {
      filter.customerId = req.user._id;
    } else if (req.user.role === 'provider') {
      filter.providerId = req.user._id;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const appointments = await Appointment.find(filter)
      .populate('customerId', 'name email')
      .populate('providerId', 'name email')
      .populate('serviceId', 'name price duration')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json(appointments);
  } catch (err) {
    next(err);
  }
};

// @route GET /api/appointments/:id
exports.getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('customerId', 'name email')
      .populate('providerId', 'name email')
      .populate('serviceId', 'name price duration');

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const isOwner =
      appointment.customerId._id.toString() === req.user._id.toString() ||
      appointment.providerId._id.toString() === req.user._id.toString();

    if (!isOwner) {
      return res.status(403).json({ message: 'Not authorized to view this appointment' });
    }

    res.status(200).json(appointment);
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/appointments/:id
// Update status. Provider can confirm/reject/complete. Customer can cancel.
exports.updateAppointment = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'A valid status is required' });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const isCustomer = appointment.customerId.toString() === req.user._id.toString();
    const isProvider = appointment.providerId.toString() === req.user._id.toString();

    if (!isCustomer && !isProvider) {
      return res.status(403).json({ message: 'Not authorized to update this appointment' });
    }

    // Customers may only cancel their own appointments
    if (isCustomer && status !== 'cancelled') {
      return res.status(403).json({ message: 'Customers can only cancel appointments' });
    }

    // Providers may confirm, reject(cancel) or complete
    if (isProvider && !['confirmed', 'cancelled', 'completed'].includes(status)) {
      return res.status(403).json({ message: 'Invalid status update for provider' });
    }

    // If moving to cancelled, free up the slot again
    if (status === 'cancelled' && appointment.status !== 'cancelled') {
      await Availability.findByIdAndUpdate(appointment.slotId, { $set: { isBooked: false } });
    }

    appointment.status = status;
    await appointment.save();

    res.status(200).json(appointment);
  } catch (err) {
    next(err);
  }
};

// @route DELETE /api/appointments/:id
// Cancels/removes an appointment and frees the slot
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const isCustomer = appointment.customerId.toString() === req.user._id.toString();
    const isProvider = appointment.providerId.toString() === req.user._id.toString();

    if (!isCustomer && !isProvider) {
      return res.status(403).json({ message: 'Not authorized to delete this appointment' });
    }

    await Availability.findByIdAndUpdate(appointment.slotId, { $set: { isBooked: false } });
    await appointment.deleteOne();

    res.status(200).json({ message: 'Appointment deleted successfully' });
  } catch (err) {
    next(err);
  }
};
