'use strict';

class InternalServerError extends Error {
  constructor(message, status) {
    super();
    this.status = status || 500;
    this.message = message || 'Internal Server Error';
  }
}

class NotFound extends Error {
  constructor(message, status) {
    super();
    this.status = status || 404;
    this.message = message || 'Not Found';
  }
}

class Unauthorised extends Error {
  constructor(message, status) {
    super();
    this.status = status || 401;
    this.message = message || 'Unauthorised';
  }
}

class HttpError extends Error {
  constructor(message, status) {
    super();
    this.status = status || 500;
    this.message = message;
  }
}

exports.InternalServerError = InternalServerError;
exports.NotFound = NotFound;
exports.HttpError = HttpError;
exports.Unauthorised = Unauthorised;
