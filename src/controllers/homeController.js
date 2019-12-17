const moment = require('moment');

const sepService = require('../services/sep');
const sep = require('../config/sep');

module.exports = () => {
    var homeController = new Object();

    function notFound(next) {
        const error = new Error('Processo não encontrado.');
        error.status = 404;
        error.handled = true;
        error.userMessage = error.message;
        next(error);
    }

    function wrongNumber(next) {
        const error = new Error('O número do processo está em um formato inválido.');
        error.userMessage = error.message;
        error.handled = true;
        error.status = 400;

        return next(error);
    }



    homeController.getSingle = (req, res, next) => {
        const service = sepService();

        const procNumber = req.params.number;

        if (!service.validProtocolNumber(procNumber)) {
            return wrongNumber(next);
        }

        service.getDocumentInfo(procNumber)
            .then(result => {
                if (!result || typeof result !== 'object') {
                    throw new Error('Result not expected.');
                }

                const p = result.ProcessoHistorico;

                if (!p.Situacao) {
                    return notFound(next);
                }

                let updates = [];
                if (p.Andamento && p.Andamento.ProcessoLocalizacao) {
                    updates = p.Andamento.ProcessoLocalizacao.map(a => {
                        return {
                            date: moment(a.Data, 'DD/MM/YYYY HH:mm'),
                            agency: a.Orgao,
                            area: a.Local,
                            status: a.Situacao
                        };
                    });
                }

                const info =
                {
                    number: p.NumeroEDocs || p.NumeroProcesso,
                    parts: p.Interessado ? p.Interessado.string : undefined,
                    subject: p.ItemPlanoClassificacao || p.Assunto,
                    summary: p.Resumo,
                    status: p.Situacao,
                    updates: updates,
                    district: p.Municipio,
                    extra: p.IdentificacoesDiversas,
                    pageUrl: sep.url_web + p.NumeroProcesso
                };

                return res.json(info);
            })
            .catch(err => {
                next(err);
            });
    };

    homeController.getSingleResumed = (req, res, next) => {
        const service = sepService();

        const procNumber = req.params.number;

        if (!service.validProtocolNumber(procNumber)) {
            return wrongNumber(next);
        }

        service.getDocumentInfoResumed(procNumber)
            .then(result => {
                if (!result || typeof result !== 'object') {
                    throw new Error('Result not expected.');
                }

                const p = result.ProcessoSefaz;

                if (!p.Interessado) {
                    return notFound(next);
                }

                // infos não retornadas: Responsavel, Telefone, Ramal, ProcessoAnexado, InscricaoEstadual, CNPJ, CPF
                const info =
                {
                    number: p.NumeroEDocs || p.NumeroProcesso,
                    parts: p.Interessado.string,
                    dataAutuacao: p.DataAutuacao,
                    situacao: p.Situacao,
                    dataUltAndamento: p.DataUltAndamento,
                    orgaoUltAndamento: p.OrgaoUltAndamento,
                    localUltAndamento: p.LocalUltAndamento,
                    identificacaoDiversas1: p.IdentificacaoDiversas1,
                    identificacaoDiversas2: p.IdentificacaoDiversas2,
                    subject: p.Assunto,
                    summary: p.Resumo,
                    status: p.Situacao,
                    pageUrl: sep.url_web + p.NumeroProcesso,
                    conclusao: p.Conclusao
                };

                return res.json(info);
            })
            .catch(err => {
                next(err);
            });
    };

    return homeController;
};
