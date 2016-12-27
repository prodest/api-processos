module.exports = {
    service_url: process.env.SEP_SERVICE_URL || 'http://www.protocolo.es.gov.br/consultarprocessoservice.asmx?WSDL',
    data_service_url: process.env.DATA_SERVICE_URL || 'http://localhost:4242/sep/data/favorite/:number/users',
    data_service_auth_token: process.env.DATA_SERVICE_AUTH_TOKEN || '1234',
    url_web: process.env.SEP_URL_WEB || 'https://sistemas.es.gov.br/prodest/consultaprocesso/consultaprocesso/?id='
};
