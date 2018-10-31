module.exports = {
  push_url: process.env.SEND_PUSH_URL || 'https://api.es.gov.br/push/send-android-ios',
  username: process.env.AUTH_USERNAME || 'pushprodest',
  password: process.env.AUTH_PASSWORD || 'danpapa'
};
