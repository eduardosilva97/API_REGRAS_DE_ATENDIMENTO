const server = require('./config/server/server.js');

const PORTA = 3001;
server.listen(PORTA, () => {
  console.log(`API sendo executada na porta ${PORTA}`);
});