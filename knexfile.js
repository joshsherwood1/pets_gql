// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/furbabies',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true,
  },

  production: {
    client: 'pg',
    connection: 'postgres://nnzyruqxaalmli:45b374a5633096c33743b04d3626617d2617e96967e791628a010df13fbf99a3@ec2-174-129-33-196.compute-1.amazonaws.com:5432/dalf3khq3muke5',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    },
    useNullAsDefault: true
  }
};
