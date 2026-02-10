## Como rodar (Back-end)
Certifique-se de estar na pasta backend.

1. Navegue até src/main/resources/.

2. Renomeie o arquivo application.properties.example para application.properties.

3. Configure as credenciais do seu banco de dados (MySQL) no arquivo.

4. Inicie o projeto com: ./mvnw quarkus:dev
## Como rodar o teste unitário back-end
Na pasta backend, rode: ./mvnw quarkus:dev, que o programa irá testar sozinho.

## Como rodar (Front-end)
Certifique-se de estar na pasta frontend.

1. Instale as dependências com: bun install ou npm install.

2. Rode o front-end com: bun dev ou npm run dev.

3. O sistema estará disponível em: http://localhost:8081 (ou conforme indicado no terminal).

## Como rodar o teste unitário do front-end
Na pasta frontend, rode: bun test ou npm test.