const config = {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost/jobs',
  api: process.env.API_URL || '/api',
  port: parseInt(`${process.env.PORT || 5000}`),
};

export default config;
