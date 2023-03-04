const bcrypt = require('bcrypt');
const prisma = require('../../prisma/prisma');
const { createToken } = require('../utils/jwtoken');
const {
  errorCode,
  failCode,
  successCode,
  notFoundCode,
} = require('../utils/response');

const register = async (req, res) => {
  try {
    const { email, password, name, age } = req.body;

    const isEmailExisted = await prisma.user.findUnique({
      where: { email },
    });

    if (isEmailExisted) {
      return failCode(res, 'Email is already existed!');
    }

    const newUser = {
      email,
      name,
      age,
      password: bcrypt.hashSync(password, 10),
    };

    await prisma.user.create({
      data: newUser,
    });

    return successCode(res, 'Register successfully!', req.body);
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userFound = await prisma.user.findUnique({
      where: { email },
    });

    if (userFound) {
      const isPasswordCorrect = bcrypt.compareSync(
        password,
        userFound.password
      );

      if (isPasswordCorrect) {
        const token = createToken(userFound.userId);

        return successCode(res, 'Login successfully!', token);
      } else {
        return failCode(res, 'Wrong combination of email and password!');
      }
    }

    return notFoundCode(res, 'Email is not existed!');
  } catch (error) {
    console.log(error);
    return errorCode(res);
  }
};

module.exports = { register, login };
