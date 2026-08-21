const apiResponse = (statusCode,data = null,message = "") => {
    return {
    success: statusCode < 400,
    statusCode,
    data,
    message
    };
}

module.exports = apiResponse;