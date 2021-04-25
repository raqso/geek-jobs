const config = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost/jobs',
  api: process.env.API || '/api'
};

export default config;
