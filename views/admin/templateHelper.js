module.exports = (errors, propertyName) => {
    try {
        return errors.mapped()[propertyName].msg
    } catch (error) {
        return ""
    }
};