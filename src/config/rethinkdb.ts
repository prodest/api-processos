export default {
    host: process.env.RETHINK_HOST || 'localhost',
    port: process.env.RETHINK_PORT || 28015,
    authKey: process.env.RETHINK_AUTH_KEY || '',
    db: process.env.RETHINK_RETHINK_DB || 'espm'
};
