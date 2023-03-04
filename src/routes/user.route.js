const express = require('express');
const {
  getUserDetail,
  getPicturesUploadedByUser,
  updateUser,
  getPicturesSavedByUser,
} = require('../controllers/user.controller');
const { checkToken } = require('../utils/jwtoken');
const { validateBody, updateUserSchema } = require('../utils/validation');

const userRoute = express.Router();

userRoute.get(
  '/:userId/pictures-uploaded',
  checkToken,
  getPicturesUploadedByUser
);
userRoute.get('/:userId/pictures-saved', checkToken, getPicturesSavedByUser);
userRoute.put(
  '/:userId/update',
  [checkToken, validateBody(updateUserSchema)],
  updateUser
);
userRoute.get('/:userId', checkToken, getUserDetail);

module.exports = userRoute;
