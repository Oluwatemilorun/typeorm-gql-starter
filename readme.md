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

- ### Dependency Injection and Loaders
  [Awilix](https://github.com/jeffijoe/awilix) is used to implement and manage dependcy injection accross the app. A dependency container ([AppContainer](./src/shared/container.ts)) is created to register essential resources which can then be accessed in classes and endpoints using the dependency container. Loaders are used to initialize the database connection, load plugins, register resources in the dependency container, and more.

  The loaded and registed resources in the container are
  - All Entity Models

    An array of all database entities that is passed to Typeorm when connecting to the database. Any file of `*.model.ts` extention in the `models/` directory that has the TypeORM `@Entity` decorator will be automatically loaded, registered and added to the enitity manager. Each entity is registered under its camel-case name followed by Model. For example, the `Category` entity is stored under `categoryModel`.
  
  - All Repositories

    An array of instances of each repository. Any file of `*.repository.ts` extention in the `repositories/` directory is auto loaded and registered. Each repository is registered under its camel-case name. For example, `CategoryRepository` is stored under `categoryRepository`.
  
  - All Services

    Services that extend the [BaseService](./src/shared/service.ts). Any file of `*.service.ts` extention in the `services/` directory is auto loaded and registered. Each service is registered under its camel-case name. For example, the `CategoryService` is registered as `categoryService`.

  - All Resolvers

    Graphql resolvers exposing the graphql `Queries`, `Mutations` and other schemas. Any file of `*.resolver.ts` extention in the `resolvers/` directory is auto loaded, registered and provided into the `TypeGraphql` instance which in turns build the schema and provides it to the Apollo server.
  

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

### Migrations
```sh
# Generate migrations
$ yarn db:generate-migrations <NAME-OF-MIGRATION> --env=development

# Run migrations
$ yarn db:run-migrations --env=development
```

### Build and Run
```sh
$ yarn start:dev
```

## Production

