# Book Analytics Front-end

This is a personal project that I used to learn GraphQL.

This is the front-end application code that uses ReactJS, Apollo Client, and Victory Charts to display some information about the books I am reading.

The back-end GraphQL server is available [here](https://www.github.com/emckay/books-back-end).

## Development

```
git clone git@github.com:emckay/books-front-end.git
cd books-front-end
cp .env.development.local.example .env.development.local
yarn
```

While packages are installing, look at the `.env.development.local` file and make any changes needed to the environment variables.

Once everything is done:

```
yarn start
```

## Deployment

Deployment is currently done with [Surge](https://surge.sh), but this can easily be changed as needed.

To deploy, first copy the `.env.production.example` file to `.env.production` and provide the missing environment variables.

Then:

```
yarn build
yarn deploy
```
