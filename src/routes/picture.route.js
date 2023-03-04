const express = require('express');
const {
  getPictures,
  uploadPicture,
  getPictureDetail,
  addCommentToPicture,
  getCommentsOfPicture,
  saveOnePicture,
  getSavingStatusOfPicture,
  deletePicture,
} = require('../controllers/picture.controller');
const { checkToken } = require('../utils/jwtoken');
const upload = require('../utils/uploadPicture');
const { validateBody, commentSchema } = require('../utils/validation');

const pictureRoute = express.Router();

pictureRoute.get('/', checkToken, getPictures);
pictureRoute.post(
  '/upload-picture',
  [checkToken, upload.single('file')],
  uploadPicture
);
pictureRoute.post(
  '/:pictureId/comments',
  [checkToken, validateBody(commentSchema)],
  addCommentToPicture
);
pictureRoute.get('/:pictureId/comments', checkToken, getCommentsOfPicture);
pictureRoute.get(
  '/:pictureId/saving-status',
  checkToken,
  getSavingStatusOfPicture
);
pictureRoute.get('/:pictureId', checkToken, getPictureDetail);
pictureRoute.post('/:pictureId', checkToken, saveOnePicture);
pictureRoute.delete('/:pictureId', checkToken, deletePicture);

module.exports = pictureRoute;
