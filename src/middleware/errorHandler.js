
const errorHandler = (err, req, res, next) => {
    console.error("Lỗi xảy ra:", err);
    console.error(err);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Đã xảy ra lỗi máy chủ. Vui lòng thử lại sau!";

    res.status(statusCode).render('error', {
        title: `Lỗi ${statusCode}`,
        message: message,
        statusCode: statusCode,
        stack: process.env.NODE_ENV === 'development' ? err.stack : null
    });
};

module.exports = errorHandler;