const express = require('express');
const app = express();
const logger = require('./logger');

app.use(express.json());

app.use((req, res, next) => {
  logger.info('Requisição Recebida', {
    metodo: req.method,
    url: req.url,
    headers: req.headers,
    corpo: req.body,
    ip: req.ip,
  });
  next();
});

app.post('/login', (req, res) => {
  const { username } = req.body;
  if (username) {
    logger.info('Usuário Autenticado', { username });
    res.status(200).send('Login bem-sucedido');
  } else {
    logger.warning('Falha no Login', { motivo: 'Username ausente' });
    res.status(400).send('Falha no login');
  }
});

app.post('/debug', (req, res) => {
  let { testParam } = req.body;

  const text = testParam || "Connect to Database";
  logger.debug('Parâmetro recebido para depuração', { text });

  if (!text) {
    logger.warning('Parâmetro de depuração ausente', { motivo: 'text não foi fornecido' });
    return res.status(400).send('Parâmetro ausente');
  }

  res.status(200).send('Debug bem-sucedido');
});

app.post('/error', async (req, res) => {
  const { operation } = req.body;

  try {
    if (operation === 'save') {
      throw new Error('Falha ao salvar os dados');
    }

    logger.info('Operação concluída com sucesso', { operation });
    res.status(200).send('Operação concluída');
  } catch (error) {
    logger.error('Erro na operação', { error: error.message });
    res.status(500).send('Erro ao processar a operação');
  }
});


app.post('/critical', (req, res) => {
  let { serviceName } = req.body;

  serviceName = serviceName || "Main Service";

  const criticalError = `Serviço ${serviceName} indisponível`;
  logger.critical('Erro crítico detectado', { serviceName, error: criticalError });

  res.status(503).send(`Erro crítico: ${criticalError}`);
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Servidor rodando na porta ${PORT}`);
});
