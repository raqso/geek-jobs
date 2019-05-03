import puppeteer from 'puppeteer';
import JobFetcher from './JobFetcher';
import dotenv from 'dotenv';

dotenv.config();

export default async function launchScrapping() {
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
      devtools: false
    });

    await new JobFetcher(browser).start();
    await browser.close();
  } catch (error) {
    console.warn('Error has been occured! ', error);
  }
}
