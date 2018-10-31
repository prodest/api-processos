const dataService = require('../services/data')();
const pushService = require('../services/push')();

module.exports = () => {
  var processController = new Object();

  processController.update = (req, res, next) => {
    const data = req.body;

    dataService
      .getUsersBySepProtocol(data.number)
      .then(usersToPush => {
        const pushData = {
          users: usersToPush,
          title: '',
          message: `Processo ${data.number} atualizado`,
          state: 'app.sepConsulta/:processNumber',
          stateParams: {
            processNumber: `${data.number}`
          },
          icon: 'notification'
        };

        return pushService.sendPush(pushData);
      })
      .then(() => {
        console.log(`Atualização no processo ${data.number} enviada com sucesso ao push server.\n`);
        return res.send('ok');
      })
      .catch(error => next(error));
  };

  return processController;
};
