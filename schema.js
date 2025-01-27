const Joi = require("joi");

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().min(5).max(100).required()
            .messages({
                "string.empty": "Title is required.",
                "string.min": "Title must be at least 5 characters long.",
                "string.max": "Title must not exceed 100 characters."
            }),
        description: Joi.string().min(10).required()
            .messages({
                "string.empty": "Description is required.",
                "string.min": "Description must be at least 10 characters long."
            }),
        price: Joi.number().min(0).required()
            .messages({
                "number.base": "Price must be a number.",
                "number.min": "Price must be 0 or higher."
            }),
        location: Joi.string().required()
            .messages({
                "string.empty": "Location is required."
            }),
        country: Joi.string().required()
            .messages({
                "string.empty": "Country is required."
            }),
        image: Joi.string().uri().allow("", null)
            .messages({
                "string.uri": "Image must be a valid URL."
            })
    }).required()
});

module.exports = { listingSchema };
