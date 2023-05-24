#!/bin/sh
set -e

MIGRATION_NAME=$1

shift 1

ENV=$@

ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:generate -d ./dist/db/datasource.js ./src/db/migrations/$MIGRATION_NAME -- $ENV
