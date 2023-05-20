# TypeORM + GraphQL + Express

A somewhat fully featured start template Express server application using Graphql and TypeORM.

## Features
- ### Security
  A couple of security features have been implemented to help with DDoS, CSRF etc. This implementation should be regarded as starting points and should be built on. A list of integegrations
  - [Express Helmet](https://github.com/helmetjs/helmet) - secure Express apps by setting HTTP response headers.
  - [Graphql Query Complexity Analysis](https://github.com/slicknode/graphql-query-complexity) - to help monitor/calculate/set the max query complexity/depth
  - [Rate Limiter](https://github.com/animir/node-rate-limiter-flexible) - to help handle Throttling based on Query Complexity. See graphql security [guide](https://www.howtographql.com/advanced/4-security/)

- ### Validations
  Since this is built around TypeORM, [class-validator](https://github.com/typestack/class-validator) was adopted to handle graphql argument and input validations. This builds on top of the regular apollo graphql field validation.
  

## Development

### Requirements
- Node.js 14
- PostgresQL
- Typescript

### Major Dependencies
- TypeORM
- [Type Graphql](https://typegraphql.com)
- [Apollo Server](https://www.apollographql.com/docs/apollo-server) + Express

### Install
To install dependencies, using then yarn pkg manager
```sh
$ yarn install
```

### Build and Run
```sh
$ yarn start:dev
```

## Production

