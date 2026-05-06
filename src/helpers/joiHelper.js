const Joi = require("joi");

const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirm_password: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .messages({
            "any.only": "Mật khẩu xác nhận không khớp"
        })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

module.exports = {
    registerSchema,
    loginSchema
};