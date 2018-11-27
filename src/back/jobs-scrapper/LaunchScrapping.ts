import puppeteer from 'puppeteer';
import JobFetcher from './JobFetcher';

export default async function launchScrapping() {
  try {
    const browser = await puppeteer.launch({
      // headless: false
      // devtools: true
    });

    await new JobFetcher(browser).start();
    browser.close();
  } catch (error) {
    console.warn('Error has been occured! ', error);
  }
}