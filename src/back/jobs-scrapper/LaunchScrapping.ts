import puppeteer from 'puppeteer';
import JobFetcher from './JobFetcher';
import JobsPl from './sites/JobsPl';

export default async function launchScrapping() {
  try {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      // headless: false,
      // devtools: true
    });

    await new JobFetcher(browser, [new JobsPl(browser)]).start();
    browser.close();
  } catch (error) {
    console.warn('Error has been occured! ', error);
  }
}