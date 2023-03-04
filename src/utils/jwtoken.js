const jwt = require('jsonwebtoken');
const config = require('./config');
const { unauthCode } = require('./response');
require('dotenv').config();

const secretKey = config.SECRET_KEY;
const tokenLife = config.TOKEN_LIFE;

const createToken = (data) => {
  const token = jwt.sign({ content: data }, secretKey, {
    expiresIn: tokenLife,
  });
  return token;
};

const verifyToken = (token) => {
  const verifyResult = jwt.verify(token, secretKey);
  console.log('Verify result', verifyResult);
  return verifyResult;
};

const checkToken = (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];

    const isTokenValid = verifyToken(accessToken);
    if (isTokenValid) {
      next();
    }
  } catch (error) {
    console.log(error);
    return unauthCode(res);
  }
};

module.exports = {
  createToken,
  verifyToken,
  checkToken,
};
