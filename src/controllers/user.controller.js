const e = require('cors');
const prisma = require('../../prisma/prisma');
const { userWithoutPassword } = require('../utils/exclude');
const { verifyToken } = require('../utils/jwtoken');
const {
  errorCode,
  notFoundCode,
  successCode,
  unauthCode,
  failCode,
} = require('../utils/response');

const getUserDetail = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId && !isNaN(userId)) {
      const result = await prisma.user.findUnique({
        where: { userId: +userId },
        select: userWithoutPassword,
      });

      if (result) {
        return successCode(
          res,
          `Get user with id ${userId} successfully!`,
          result
        );
      }

      return notFoundCode(res, `Cannot find user with id ${userId}!`);
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const getPicturesUploadedByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId && !isNaN(userId)) {
      const user = await prisma.user.findUnique({
        where: { userId: +userId },
      });

      if (user) {
        const result = await prisma.picture.findMany({
          where: { userUploadId: +userId },
          include: { userUpload: true },
        });

        if (result) {
          return successCode(
            res,
            `Get pictures uploaded by user id ${userId} successfully!`,
            result
          );
        }
      } else {
        return notFoundCode(res, `Cannot find user with id ${userId}!`);
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const getPicturesSavedByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId && !isNaN(userId)) {
      const user = await prisma.user.findUnique({
        where: { userId: +userId },
      });

      if (user) {
        const result = await prisma.savePicture.findMany({
          where: { userSaveId: +userId },
          include: { pictureSaved: true, userSave: true },
        });

        if (result) {
          return successCode(
            res,
            `Get pictures saved by user id ${userId} successfully!`,
            result
          );
        }
      } else {
        return notFoundCode(res, `Cannot find user with id ${userId}!`);
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const updateUser = async (req, res) => {
  try {
    const currentUserId = verifyToken(
      req.headers.authorization.split(' ')[1]
    ).content;
    const { userId } = req.params;
    const { email, avatar, name, age } = req.body;
    const newUserData = { email, avatar, name, age };

    if (userId && !isNaN(userId)) {
      if (currentUserId === +userId) {
        const user = await prisma.user.findUnique({
          where: { userId: +userId },
        });

        if (user) {
          const emailExists = await prisma.user.findUnique({
            where: { email },
          });

          if (!emailExists || email === user.email) {
            const result = await prisma.user.update({
              where: { userId: +userId },
              data: { ...newUserData },
              select: userWithoutPassword,
            });

            if (result) {
              return successCode(
                res,
                `Update user with id ${userId} successfully!`,
                result
              );
            }
          } else {
            return failCode(res, 'Email already existed!');
          }
        }
        return notFoundCode(res, `Cannot find user with id ${userId}!`);
      } else {
        return unauthCode(res, "Cannot edit other user's profile!");
      }
    }

    return notFoundCode(res);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

module.exports = {
  getUserDetail,
  getPicturesUploadedByUser,
  getPicturesSavedByUser,
  updateUser,
};
