const soap = require('soap-as-promised');
const sep = require('../config/sep');

module.exports = () => {
    var sepService = new Object();

    const maskSigefes = /^\d{2,13}$/;
    const maskEDocs = /^20\d{2}-*[0-9b-df-hj-np-tv-xzB-DF-HJ-NP-TV-XZ]{5,6}$/;
    const maskProtocol = /^\d{2,8}$/;
    const codeCharList = "0123456789BCDFGHJKLMNPQRSTVWXZ";

    transformProtocol = (number) => {
        let protocoloSigefes = null;

        let [year, code] = number.split('-');

        if (code != null) {
            let codeBase10 = 0;

            for (let i = 0; i < code.length; i++) {
                let digit = code.substr(i, 1);
                let position = codeCharList.indexOf(digit);
                let powNumber = code.length - (i + 1);
                codeBase10 += position * Math.pow(codeCharList.length, powNumber);
            }

            //Foi colocado propositalmente o caracter 0 para reservar um possível aumento do campo
            const sigefesCode = codeBase10.toString().padStart(9, '0');
            protocoloSigefes = '' + year + sigefesCode;
        }

        return protocoloSigefes;
    }

    isEDocs = (number) => {
        return maskEDocs.test(number);
    }

    isSigefes = (number) => {
        return maskSigefes.test(number);
    }

    isSep = (number) => {
        return maskProtocol.test(number);
    }

    sepService.getDocumentInfo = (processNumber) => {
        var args = {
            numeroProcesso: processNumber
        };

        return soap.createClient(sep.service_url)
            .then(client => client.ConsultarProcessoSimplesPorString(args));
    };

    sepService.getDocumentInfoResumed = (processNumber) => {
        if (isEDocs(processNumber)) {
            processNumber = transformProtocol(processNumber);
        }

        var args = {
            numeroProcesso: processNumber
        };

        return soap.createClient(sep.service_url)
            .then(client => client.ConsultarProcessoSefazPorNumero(args));
    };

    sepService.validProtocolNumber = (number) => {
        return isSep(number) || isEDocs(number) || isSigefes(number);
    }

    return sepService;
};
