const express = require('express');
const router = express.Router();
const {
  getAvailability,
  createAvailability,
  deleteAvailability
} = require('../controllers/availabilityController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAvailability);
router.post('/', protect, authorize('provider'), createAvailability);
router.delete('/:id', protect, authorize('provider'), deleteAvailability);

module.exports = router;
