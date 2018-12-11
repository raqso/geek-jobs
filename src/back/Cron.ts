import cron from 'node-cron';
import launchScrapping from './jobs-scrapper/LaunchScrapping';

cron.schedule('* */6 * * *', () => {
  console.log('running scrapping every 6 hours');
  try {
    launchScrapping();
  } catch (error) {
    console.warn('Error during scrapping! ' + error);
  }
});