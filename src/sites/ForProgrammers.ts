import { Browser, Page } from 'puppeteer';

export default class ForProgrammers implements Site {
  name = '4Programmers.net';
  address = 'https://4programmers.net';
  endpointAddress = 'https://4programmers.net/Praca';
  browser: Browser;
  page: any;

  constructor(browserObject: Browser) {
    this.browser = browserObject;
  }

  async getJobs() {
    const lastPageButtonSelector =
      '#job-main-content > main > nav.pull-left > ul > li:last-child > a';
    let jobOffers: Job[] = [];
    this.page = await this.browser.newPage();
    await this.page.setRequestInterception(true);
    this.page.on('request', (req: any) => {
      if (
        req.resourceType() === 'stylesheet' ||
        req.resourceType() === 'font' ||
        req.resourceType() === 'image'
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await this.page.goto('https://4programmers.net/Praca');

    let isLast = await this.isLastPage();
    while (!isLast) {
      jobOffers.push(...(await this.getJobsForThePage()));
      const [] = await Promise.all([
        this.page.waitForNavigation(),
        this.page.click(lastPageButtonSelector)
      ]);

      isLast = await this.isLastPage();
    }

    await this.page.close();
    return jobOffers;
  }

  async isLastPage() {
    return await this.page.evaluate(() => {
      const pageButtons = document.querySelectorAll(
        '#job-main-content > main > nav.pull-left > ul > li'
      );
      return (
        !pageButtons ||
        !pageButtons.length ||
        pageButtons[pageButtons.length - 1].firstChild.innerText !== '»'
      );
    });
  }

  async getJobsForThePage() {
    return await this.page.evaluate(() => {
      clearSalaryString = function(salaryText) {
        return salaryText.replace(/( |\r\n\t|\n|\r\t )/gm, '');
      };
      const allJobs = [
        ...document
          .querySelector('#box-jobs')
          .querySelectorAll('table tbody tr')
      ];
      let jobOffers: Job[] = [];

      allJobs.forEach(job => {
        const position = job.querySelector('.col-body h2')
          ? job.querySelector('.col-body h2').innerText
          : '';
        const link = job.querySelector('.col-body h2 a')
          ? job.querySelector('.col-body h2 a').href
          : '';
        const company = job.querySelector('.col-body p a')
          ? job.querySelector('.col-body p a').innerText
          : '';
        const companyLogo = job.querySelector('.col-logo > a > img')
          ? job.querySelector('.col-logo > a > img').src
          : '';
        const location = job.querySelector('.col-body p  .location a').innerText
          ? job.querySelector('.col-body p  .location a').innerText
          : '';
        const technologies = (() => {
          const technologiesLinks = [
            ...job.querySelectorAll('.col-body > ul > li > a')
          ];
          let technologiesNames: string[] = [];
          technologiesLinks.forEach(technologyLink => {
            if (technologyLink && technologyLink.innerText) {
              technologiesNames.push(technologyLink.innerText);
            }
          });
          return technologiesNames;
        })();
        const salary = job.querySelector('.col-body p.salary strong')
          ? job.querySelector('.col-body p.salary strong').innerText
          : '';

        jobOffers.push({
          position: position,
          company: company,
          companyLogo: companyLogo,
          location: location,
          technologies: technologies,
          salary: clearSalaryString(salary),
          link: link,
          website: '4programmers.net'
        });
      });

      return jobOffers;
    });
  }
}
