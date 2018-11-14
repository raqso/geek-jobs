import app from './app';
import cron from 'node-cron';

const PORT = 3000;

app.listen(PORT, () => {
  console.log('Express server listening on port ' + PORT);
});

cron.schedule('45 * * * *', () => {
  console.log('running a task every 45 minutes');
});