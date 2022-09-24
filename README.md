## How to run this project
### Build and run the Postgres database:
```sh
# for the first time you're building the database
$ docker run --name every_postgres -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres
# In case you already have the container
$ docker start every_postgres

# once the dabase is on, run the migrations
$ yarn typeorm migration:run
```

### Run the app:
```sh
# Run with the Dockerfile (for the first time)
$ docker build -t every_app .
$ docker container run --network="host" --name every_app -p 3001:3001 every_app

# If you already built the container image
$ docker start every_app

# Just run on local machine for development, need node and yarn installed
$ yarn
$ yarn dev
```

## How to run tests
Don't need to setup anything, it uses mocked repositories. Just install the dependencies and it is good to go.
```sh
yarn test
```

## Database basics:
```
$ yarn typeorm migration:run
$ yarn typeorm migration:revert

# to create a new migration
$ yarn typeorm migration:create -n CreateTasksTable
```
