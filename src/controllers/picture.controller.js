const dayjs = require('dayjs');
const prisma = require('../../prisma/prisma');
const config = require('../utils/config');
const { userWithoutPassword } = require('../utils/exclude');
const { verifyToken } = require('../utils/jwtoken');
const {
  successCode,
  failCode,
  errorCode,
  notFoundCode,
  unauthCode,
} = require('../utils/response');

const getPictures = async (req, res) => {
  try {
    const { name } = req.query;
    if (typeof name === 'undefined') {
      const result = await prisma.picture.findMany();

      if (result) {
        return successCode(res, 'Get all pictures successfully!', result);
      }
    } else {
      const resultSearched = await prisma.picture.findMany({
        where: { name: { contains: name } },
      });

      if (resultSearched) {
        return successCode(
          res,
          `Get pictures having '${name}' in name successfully!`,
          resultSearched
        );
      }
    }
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const getPictureDetail = async (req, res) => {
  try {
    const { pictureId } = req.params;

    if (pictureId && !isNaN(pictureId)) {
      const result = await prisma.picture.findUnique({
        where: { pictureId: +pictureId },
        include: { userUpload: { select: userWithoutPassword } },
      });

      if (result) {
        return successCode(
          res,
          `Get picture with id ${pictureId} successfully!`,
          result
        );
      } else {
        return notFoundCode(res, `Cannot find picture with id ${pictureId}!`);
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const uploadPicture = async (req, res) => {
  try {
    if (req.file) {
      const { filename } = req.file;
      const { description = '' } = req.body;
      const userUploadId = verifyToken(
        req.headers.authorization.split(' ')[1]
      ).content;
      const data = {
        name: filename,
        link: `${config.IMG_URL}/${filename}`,
        description,
        userUploadId,
      };

      const result = await prisma.picture.create({ data });

      if (result) {
        return successCode(
          res,
          'Upload a picture successfully!',
          req.file.originalname
        );
      } else {
        return failCode(res, 'Cannot upload your picture!');
      }
    }

    return failCode(res, 'Please choose a valid image file!');
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const addCommentToPicture = async (req, res) => {
  try {
    const { pictureId } = req.params;

    if (pictureId && !isNaN(pictureId)) {
      const picture = await prisma.picture.findUnique({
        where: { pictureId: +pictureId },
      });

      if (picture) {
        const { content } = req.body;
        const userCommentId = verifyToken(
          req.headers.authorization.split(' ')[1]
        ).content;

        const data = {
          content,
          userCommentId,
          pictureCommentedId: +pictureId,
        };

        const result = await prisma.comment.create({
          data,
        });

        if (result) {
          return successCode(
            res,
            `Comment to picture with id ${pictureId} successfully!`,
            result
          );
        } else {
          return errorCode(res);
        }
      }

      return notFoundCode(res, `Cannot find picture with id ${pictureId}!`);
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const getCommentsOfPicture = async (req, res) => {
  try {
    const { pictureId } = req.params;

    if (pictureId && !isNaN(pictureId)) {
      const picture = await prisma.picture.findUnique({
        where: { pictureId: +pictureId },
      });

      if (picture) {
        const result = await prisma.comment.findMany({
          where: { pictureCommentedId: +pictureId },
          include: {
            pictureCommented: true,
            userComment: { select: userWithoutPassword },
          },
        });

        if (result) {
          return successCode(
            res,
            `Get comments of picture with id ${pictureId} successfully!`,
            result
          );
        } else {
          return errorCode(res);
        }
      }

      return notFoundCode(res, `Cannot find picture with id ${pictureId}!`);
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const saveOnePicture = async (req, res) => {
  try {
    const { pictureId } = req.params;

    if (pictureId && !isNaN(pictureId)) {
      const picture = await prisma.picture.findUnique({
        where: { pictureId: +pictureId },
      });

      if (picture) {
        const userSaveId = verifyToken(
          req.headers.authorization.split(' ')[1]
        ).content;

        const data = { userSaveId, pictureSavedId: +pictureId };

        const savedAlready = await prisma.savePicture.findUnique({
          where: { savePictureData: data },
        });

        if (savedAlready) {
          const result = await prisma.savePicture.delete({
            where: { savePictureData: data },
          });

          if (result) {
            return successCode(
              res,
              `Unsave picture with id ${pictureId} successfully!`,
              result
            );
          } else {
            return errorCode(res);
          }
        } else {
          const result = await prisma.savePicture.create({ data });

          if (result) {
            return successCode(
              res,
              `Save picture with id ${pictureId} successfully!`,
              result
            );
          } else {
            return errorCode(res);
          }
        }
      }

      return notFoundCode(res, `Cannot find picture with id ${pictureId}!`);
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const getSavingStatusOfPicture = async (req, res) => {
  try {
    const { pictureId } = req.params;

    if (pictureId && !isNaN(pictureId)) {
      const picture = await prisma.picture.findUnique({
        where: { pictureId: +pictureId },
      });

      if (picture) {
        const userSaveId = verifyToken(
          req.headers.authorization.split(' ')[1]
        ).content;

        const data = { userSaveId, pictureSavedId: +pictureId };

        const savingStatus = await prisma.savePicture.findUnique({
          where: { savePictureData: data },
        });

        if (savingStatus) {
          return successCode(
            res,
            `Get your saving status of picture with id ${pictureId} successfully!`,
            savingStatus
          );
        } else if (savingStatus === null) {
          return successCode(
            res,
            `Get your saving status of picture with id ${pictureId} successfully!`,
            { isSaved: false }
          );
        } else {
          return errorCode(res);
        }
      }

      return notFoundCode(res, `Cannot find picture with id ${pictureId}!`);
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const deletePicture = async (req, res) => {
  try {
    const { pictureId } = req.params;

    if (pictureId && !isNaN(pictureId)) {
      const picture = await prisma.picture.findUnique({
        where: { pictureId: +pictureId },
      });

      if (picture) {
        const currentUserId = verifyToken(
          req.headers.authorization.split(' ')[1]
        ).content;

        if (currentUserId === picture.userUploadId) {
          await prisma.comment.deleteMany({
            where: { pictureCommentedId: +pictureId },
          });

          await prisma.savePicture.deleteMany({
            where: { pictureSavedId: +pictureId },
          });

          const result = await prisma.picture.delete({
            where: { pictureId: +pictureId },
          });

          if (result) {
            return successCode(
              res,
              `Delete picture with id ${pictureId} successfully!`,
              result
            );
          } else {
            return errorCode(res);
          }
        } else {
          return unauthCode(res, "Cannot delete other user's picture!");
        }
      }

      return notFoundCode(res, `Cannot find picture with id ${pictureId}!`);
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

module.exports = {
  getPictures,
  getPictureDetail,
  uploadPicture,
  addCommentToPicture,
  getCommentsOfPicture,
  saveOnePicture,
  getSavingStatusOfPicture,
  deletePicture,
};
