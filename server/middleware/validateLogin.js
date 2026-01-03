import Joi from 'joi';

// For registration - includes username, email, and password
export const registerSchema = Joi.object({
    username: Joi.string()
        .trim()
        .min(3)
        .max(20)
        .required(),
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/))
        .required()
});

// For login - only needs email and password
export const loginSchema = Joi.object({
    email: Joi.string()
        .email()
        .required(),
    password: Joi.string()
        .required()
});

//for updating - all fields optional
export const updateSchema = Joi.object({
    newUsername: Joi.string()
        .trim()
        .min(3)
        .max(20)
        .optional(),
    email: Joi.string()
        .email()
        .optional(),
    oldPassword: Joi.string()
        .when('newPassword', {
            is: Joi.exist(),
            then: Joi.required(),
            otherwise: Joi.optional()
        }),
    newPassword: Joi.string()
        .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/))
        .optional()
}).min(1);