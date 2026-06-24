const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getPublicProfile,
  checkUsername,
  followUser,
  unfollowUser,
  toggleFavorite
} = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/me')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.get('/check-username/:username', protect, checkUsername);

router.put('/favorites/:eventId', protect, toggleFavorite);

router.route('/:id/follow')
  .post(protect, followUser)
  .delete(protect, unfollowUser);

router.get('/:username', getPublicProfile);

module.exports = router;
