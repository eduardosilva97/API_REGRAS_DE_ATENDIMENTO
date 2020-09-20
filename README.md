# API - REGRAS DE ATENDIMENTO

Uma API desenvolvida com intuito de gerenciar horários para atendimento, aplicando regras e prioridades.

### Sobre

A API de gerenciamento de horários pode criar três tipos diferentes regras de reservas de horários sendo elas:

- Para dia especifico, onde são definidos intervalo para uma data especifica;
- Semanalmente, onde são definidos intervalos para dias especificos da semana;
- Diaria, onde são definidos intervalos padrões para todos os dias; 

Além disso a api é capaz de retornar ao usuário uma lista dos horários disponiveis para cada dia dentro de um intervalo, atendendo a seguinte prioridade de regras:
 > Regras para dia especifico > Regras semanais > Regras Diárias
 
 ### Como usar
 
 Para começar a utilizar a api basta clonar o repositório git:

 > git clone https://github.com/eduardosilva97/API_Time_Management.git
 
 Em seguida execute o seguinte comando na pasta do projeto para instalar as dependencias:
 
 > npm install
 
 Por último basta executar o arquivo app.js utilizando o nodeJS para iniciar o servidor na porta 3001:
 
 > node app.js
 
 Para informações sobre requisições e possibilidades da api consulte a documentação:
 
 https://github.com/eduardosilva97/API_REGRAS_DE_ATENDIMENTO/blob/master/Documenta%C3%A7%C3%A3o%20API%20regras%20de%20atendimento.pdf
 
 Exemplos de requisições:
 
 https://www.getpostman.com/collections/e6f572c85ccff450a85b
 
 ### Ferramentas e versões
 
 As ferramentas utilizadas para desenvolver esta API foram:
 
 - Node.JS	v12.18.3
 - NPM	6.14.6
