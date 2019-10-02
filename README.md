# api-sep
Api de consulta de processos

## Funcionalidades

- Consultar processo especifíco a partir do número do processo
- Notificar o servidor de push do ESPM sobre cada trâmite de processo executo no sistema de Protocolo ES

# Rotas

- **POST /process/update/**: notifica sobre atualização (protocolo).
- **GET /:number?/**: consulta no geral
