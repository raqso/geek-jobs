module.exports = {
  apps: [
    {
      name: 'API',
      script: './dist/back/server.js',
      instances: 1,
      autorestart: true,
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      }
    }
  ]
};
