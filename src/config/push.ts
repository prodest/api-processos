export default {
    push_url: process.env.SEND_PUSH_URL || 'https://api.es.gov.br/push/send',
    username: process.env.AUTH_USERNAME || 'pushprodest',
    password: process.env.AUTH_PASSWORD || 'danpapa'
};