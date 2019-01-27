import { Browser } from 'puppeteer';
import Job from '../jobs-scrapper/Job';
import Site from './Site';

abstract class RenderedSite implements Site {
  abstract name: string;
  abstract address: string;
  abstract logoImage: string;
  abstract endpointAddress: string;
  abstract selectors: Object;
  protected blockedResources: string[] = [];
  protected pageNumber = 1;
  protected page: any;
  protected abstract isLastPage(): Promise<boolean>;
  protected abstract getJobsForThePage(): Promise<Job[]>;
  protected abstract goToNextPage(): Promise<void>;

  browser: Browser;

  constructor(browserObject: Browser, blockedResources?: string[]) {
    this.browser = browserObject;
    if (blockedResources && blockedResources.length) {
      this.blockedResources = blockedResources;
    }
  }

  public async getJobs() {
    let jobOffers: Job[] = [];

    await this.openNewBrowserPage();
    await this.page.goto(this.endpointAddress);

    let isLast = await this.isLastPage();
    while (!isLast) {
      const offersFromOnePage = await this.getJobsForThePage();

      console.log(`#${this.name} - Page ${this.pageNumber} - ${offersFromOnePage.length} offers`);
      jobOffers.push(...offersFromOnePage);
      this.pageNumber++;
      const [] = await Promise.all([
        this.page.waitForNavigation(),
        this.goToNextPage()
      ]);
      isLast = await this.isLastPage();
    }
    this.page.close();

    return jobOffers;
  }

  protected async goToNextPageViaLastPageLink(lastPageSelector: string) {
    const nextPageLinkAddress = await this.page.evaluate((sel: string) => {
      const element = document.querySelector(sel) as HTMLAnchorElement;
      return element ? element.href : null;
    }, lastPageSelector);

    await this.goToThePage(nextPageLinkAddress);
  }

  protected async goToThePage(pageAddress: string) {
    await this.page.goto(pageAddress, { waitUntil: 'networkidle0' });
  }

  protected replaceTextToIndex(selectors: string[], index: number) {
    let changedSelectors: string[] = [];

    selectors.forEach(selector =>
      changedSelectors.push(selector.replace('INDEX', index.toString()))
    );

    return changedSelectors;
  }

  private async openNewBrowserPage() {
    this.page = await this.browser.newPage();
    await this.setFetchingHtmlOnly();
  }

  private async setFetchingHtmlOnly() {
    await this.page.setRequestInterception(true);
    if (!this.blockedResources.length) {
      this.page.on('request', (request: any) => {
        if (request.resourceType() === 'document') {
          request.continue();
        } else {
          request.abort();
        }
      });
    }
    else {
      this.page.on('request', (request: any) => {
        if (this.blockedResources.includes(request.resourceType())) {
          request.abort();
        } else {
          request.continue();
        }
      });
    }

    this.page.on('response', (response: any) => {
      const status = response.status();
      console.log(`${this.name} response status: ${status}`);
      // [301, 302, 303, 307, 308]
      /* if ((status >= 300) && (status <= 399)) {
          url_redirected = true;
      } */
  });
  }
}

export default RenderedSite;
