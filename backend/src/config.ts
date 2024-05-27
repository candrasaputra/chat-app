/* eslint no-process-env: "off" */

// NOTE: All env vars from process.env are imported as STRINGS. It is important to keep this in mind and cast your env vars as needed.

export const SERVICE_NAME = process.env.SERVICE_NAME || 'chat-backend';
export const PORT = process.env.PORT || '8080';
export const JWT_SECRET = process.env.JWT_SECRET || 'mysecret';
export const MONGO_URI = process.env.MONGO_URI || 'mongo';
