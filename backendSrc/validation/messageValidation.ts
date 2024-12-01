import Joi from 'joi';

export const messageValidationSchema = Joi.object({
    content: Joi.string().min(1).max(500).required(),
    channelId: Joi.string().pattern(/^[a-f\d]{24}$/i).required(),
});