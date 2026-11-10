"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const errors_js_1 = require("../utils/errors.js");
const logger_js_1 = require("../utils/logger.js");
function errorHandler(err, _req, res, _next) {
    const timestamp = new Date().toISOString();
    if (err instanceof errors_js_1.AppError) {
        logger_js_1.logger.warn(`Handled application error [${err.code}]: ${err.message}`, {
            statusCode: err.statusCode,
            details: err.details,
        });
        const response = {
            success: false,
            error: {
                code: err.code,
                message: err.message,
                details: err.details,
            },
            timestamp,
        };
        res.status(err.statusCode).json(response);
        return;
    }
    logger_js_1.logger.error('Unhandled Server Exception:', err);
    const response = {
        success: false,
        error: {
            code: 'INTERNAL_SERVER_ERROR',
            message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
        },
        timestamp,
    };
    res.status(500).json(response);
}
