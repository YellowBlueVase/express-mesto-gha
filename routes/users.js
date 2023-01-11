const router = require('express').Router();
const auth = require('../middlewares/auth');
const {
  getAllUsers, getUser, getProfile, updateProfile, updateAvatar, login, createUser,
} = require('../controllers/users');

router.get('/users', auth, getAllUsers);

router.get('/users/:userId', auth, getUser);

router.get('/users/me', auth, getProfile);

router.patch('/users/me', auth, updateProfile);

router.patch('/users/me/avatar', auth, updateAvatar);

router.post('/signin', login);

router.post('/signup', createUser);

module.exports = router;
