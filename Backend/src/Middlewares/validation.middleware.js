const {body,validationResult} = require("express-validator");

const validateResult = async (req,res,next) => {
    const error = validationResult(req)

    if(!error.isEmpty()){
        return res.status(400).json({
            message : error.array().map(error => error.msg)
        })
    }

    next();
}

const registerUserValidationRule = [
    body("email")
    .isEmail()
    .withMessage("enter a valid email")
    .trim()
    .notEmpty()
    .withMessage("email feild cannot be empty"),

    body("name")
    .isString()
    .notEmpty()
    .isLength({min: 3})
    .withMessage("Name feild cannot be empty, it must be a String, it must be atleast 3 characters long"),

    body("password")
    .isString()
    .notEmpty()
    .withMessage("please set a password")
    .trim()
    .isLength({min: 6})
    .withMessage("please enter a password of minimum 6 characters"),

    validateResult
]

module.exports = {registerUserValidationRule, validateResult}