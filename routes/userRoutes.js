const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getPublicProfile,
  checkUsername
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/me')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get('/check-username/:username', protect, checkUsername);

router.get('/:username', getPublicProfile);

module.exports = router;
