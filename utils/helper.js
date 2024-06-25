
// The function is universal function. Which will check whether the value entered or not.
// We can use this function any where in the whole code.
const checkValueEntered = (fieldName, messageField) => (req, res, next) => {
    return new Promise((resolve, reject) => {
        if (!fieldName || fieldName?.length === 0 || fieldName.trim() === "") {
            return res.status(200).send({
                code: 400,
                status: false,
                message: `${messageField} not entered`,
            });
        } else {
            resolve();
        }
    });
};

export { checkValueEntered }

    