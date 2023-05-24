#!/bin/sh
set -e

ENV=$@

ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./dist/db/datasource.js -- $ENV
