const AppError = require('../utils/appError');

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  }
  console.log(err);
  res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: err.message,
  });
};

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateKeyError = (err) => {
  const message = `Duplicate field value: ${err.keyValue.name}, please use anonther value`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const messages = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid Input data,  ${messages.join('. ')}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () => {
  return new AppError('Please provide a valid token', 401);
};

const handleJwtExpirationError = () => {
  return new AppError('Please login again to get access', 401);
};
const sendErrorProd = (err, req, res) => {
  // for operational error and trusted error
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
      // for unknown and untrusted error
    } else {
      return res.status(500).json({
        status: 'error',
        message: 'An unknown error occured',
      });
    }
  }

  if (err.isOperational) {
    console.log(err.message);
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  } else {
    return res.status(500).render('error', {
      title: 'Something went very wrong',
      msg: 'Please Try again later',
    });
  }
};

exports.errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    console.log(error);
    if (error.kind === 'ObjectId') {
      error = handleCastError(error);
    }
    if (error.code === 11000) {
      error = handleDuplicateKeyError(error);
    }
    if (error._message === 'Tour validation failed') {
      error = handleValidationError(error);
    }
    if (error.name === 'JsonWebTokenError') {
      error = handleJsonWebTokenError();
    }
    if (error.message === 'jwt expired') {
      error = handleJwtExpirationError();
    }
    console.log(error);
    sendErrorProd(error, req, res);
  }
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  }
};
