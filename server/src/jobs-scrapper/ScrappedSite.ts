import cheerio from 'cheerio';
import request from 'request';
import Job from '../jobs-scrapper/Job';
import Site from './Site';

abstract class ScrappedSite implements Site {
  abstract name: string;
  abstract address: string;
  abstract logoImage: string;
  abstract endpointAddress: string;
  protected abstract selectors: any;
  protected pageNumber = 1;
  protected cherrioInstance = cheerio.load('');
  protected abstract isLastPage(): Promise<boolean>;
  protected abstract getJobsForThePage(): Promise<Job[]>;

  public async getJobs() {
    let jobOffers: Job[] = [];

    await this.loadPageHtml(this.endpointAddress);

    let isLast = await this.isLastPage();
    while (!isLast) {
      const offersFromOnePage = await this.getJobsForThePage();

      console.log(
        `#${this.name} - Page ${this.pageNumber} - ${
          offersFromOnePage.length
        } offers`
      );
      jobOffers.push(...offersFromOnePage);
      this.pageNumber++;
      await this.goToNextPage();
      isLast = await this.isLastPage();
    }

    return jobOffers;
  }

  private async goToNextPage() {
    const nextPageUrl = this.cherrioInstance(this.selectors.lastPageButton).attr('href');
    if (!nextPageUrl) {
      return;
    }

    return this.loadPageHtml(nextPageUrl);
  }

  private async loadPageHtml(address: string) {
    if (address) {
      this.cherrioInstance = cheerio.load(await this.getPageHtml(address) as string);
    }
    else {
      throw new Error('Invalid url address for the next page!');
    }
  }

  private async getPageHtml(address: string) {
    const proxedAddress = `https://api.scraperapi.com?key=${process.env.SCRAPPER_API_KEY}&url=${address}`;
    return new Promise((resolve, reject) => {
      request(proxedAddress, (error, _response, html) => {
        if (!error) {
          resolve(html);
        } else {
          reject(error);
        }
      });
    });
  }
}

export default ScrappedSite;
