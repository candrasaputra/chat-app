export const ErrorCodes = {
    API_VALIDATION_ERROR: 'API_VALIDATION_ERROR',
    INVALID_JSON_FORMAT: 'INVALID_JSON_FORMAT',
    DOC_NOT_FOUND_ERROR: 'DOC_NOT_FOUND_ERROR',
    LOGIN_REJECT: 'LOGIN_REJECT',
    UNAUTHORIZED_ERROR: 'UNAUTHORIZED_ERROR'
};

export const ErrorCodeMap: { [key: string]: number } = {
    API_VALIDATION_ERROR: 400,
    INVALID_JSON_FORMAT: 400,
    UNAUTHORIZED_ERROR: 401,
    DOC_NOT_FOUND_ERROR: 404,
    LOGIN_REJECT: 409
};
