module.exports = {
    appName: process.env.NEWRELIC_APPNAME || 'Api Processos',
    key: process.env.NEWRELIC_KEY,
    level: process.env.NEWRELIC_LEVEL || 'info'
};
