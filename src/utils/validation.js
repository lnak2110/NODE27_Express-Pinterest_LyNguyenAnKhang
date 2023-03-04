const yup = require('yup');
const { failCode } = require('./response');

const registerSchema = yup.object({
  body: yup.object({
    email: yup.string().trim().email().required(),
    name: yup.string().trim().required(),
    age: yup.number().min(1).max(99),
    password: yup.string().trim().min(4).max(10).required(),
  }),
});

const loginSchema = yup.object({
  body: yup.object({
    email: yup.string().trim().email().required(),
    password: yup.string().trim().min(4).max(10).required(),
  }),
});

const updateUserSchema = yup.object({
  body: yup.object({
    email: yup.string().trim().email().required(),
    name: yup.string().trim().required(),
    age: yup.number().min(1).max(99),
    avatar: yup.string().trim().url(),
  }),
});

const commentSchema = yup.object({
  body: yup.object({
    content: yup.string().trim().required(),
  }),
});

const validateBody = (schema) => (req, res, next) => {
  try {
    schema.validateSync({
      body: req.body,
    });

    next();
  } catch (error) {
    console.log(error);
    return failCode(res, error.message);
  }
};

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
  commentSchema,
  validateBody,
};
