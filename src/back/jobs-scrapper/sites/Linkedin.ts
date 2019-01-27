import RenderedSite from '../RenderedSite';
import Job from '../Job';

export default class Linkedin extends RenderedSite {
  readonly name = 'Linkedin';
  readonly address = 'https://linkedin.com';
  readonly logoImage =
    'https://pl.linkedin.com/scds/common/u/images/logos/linkedin/logo_linkedin_white_text_blue_inbug_312x80_v1.png';
  readonly endpointAddress =
    'https://pl.linkedin.com/jobs/search?locationId=pl&f_F=it';

  protected async goToNextPage() {
    const offersPerPage = 25;
    const nextPageAddress = `${this.endpointAddress}&jobs_jserp_pagination_${this.pageNumber}&start=${this.pageNumber * offersPerPage - offersPerPage}&count=${offersPerPage}`;

    await this.goToThePage(nextPageAddress);
  }

  protected async isLastPage() {
    return await this.page.evaluate((sel: string, pageNumber: number) => {
      const element = document.querySelector(sel) as HTMLAnchorElement;
      return element && Number(element.innerText) ===  pageNumber ? true : false;
    }, this.selectors.lastPageButton, this.pageNumber);
  }

  protected async getJobsForThePage() {
    const listLength = await this.page.evaluate((selector: string) => {
      return document.querySelectorAll(selector).length;
    }, this.selectors.offersLength);

    let jobOffers: Job[] = [];
    for (let i = 1; i <= listLength; i++) {
      const [
        positionSelector,
        offerLinkSelector,
        citySelector,
        addedDateSelector,
        companySelector,
        companyLogoSelector
      ] = this.replaceTextToIndex(
        [
          this.selectors.listPosition,
          this.selectors.listOfferLink,
          this.selectors.listLocation,
          this.selectors.listAddedDate,
          this.selectors.listCompany,
          this.selectors.listCompanyLogo
        ],
        i
      );

      const position = await this.page.evaluate((sel: string) => {
        const element = document.querySelector(sel) as HTMLHeadingElement;
        return element ? element.innerText : null;
      }, positionSelector);

      if (position) {
        const offerLink = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLAnchorElement;
          return element ? element.href : null;
        }, offerLinkSelector);

        const location = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLParagraphElement;
          return element ? element.innerText.trim() : null;
        }, citySelector);

        const addedDate = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLSpanElement;
          return element ? element.innerText : null;
        }, addedDateSelector);

        const company = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLHeadingElement;
          return element ? element.innerText : null;
        }, companySelector);

        const companyLogo = await this.page.evaluate((sel: string) => {
          const element = document.querySelector(sel) as HTMLImageElement;
          return element ? element.getAttribute('data-delayed-url') : null;
        }, companyLogoSelector);

        jobOffers.push({
          addedDate: this.getOfferDate(addedDate),
          dateCrawled: new Date(),
          link: offerLink,
          location: location,
          position: position,
          company: company,
          companyLogo: companyLogo,
          website: this.name,
          portalLogo: this.logoImage
        } as Job);
      }
    }

    return jobOffers;
  }

  private getOfferDate(created: string) {
    if (created === 'Nowe') {
      return new Date();
    } else if (created && typeof created === 'string') {
      const howMany = Number(created.split(' ')[0]);
      const unit: 'godziny' | 'dni' | 'tygodnie' | string = created.split(
        ' '
      )[1];
      let todayDate = new Date();

      switch (unit) {
        case 'minut':
        case 'minuty':
        case 'minutę': {
          todayDate.setMinutes(todayDate.getMinutes() - howMany);
          return todayDate;
          break;
        }
        case 'godzin':
        case 'godziny':
        case 'godzinę': {
          todayDate.setHours(todayDate.getHours() - howMany);
          return todayDate;
          break;
        }
        case 'dni':
        case 'dzień': {
          todayDate.setDate(todayDate.getDate() - howMany);
          return todayDate;
          break;
        }
        case 'tygodni':
        case 'tydzień':
        case 'tygodnie': {
          todayDate.setDate(todayDate.getDate() - howMany * 7);
          return todayDate;
          break;
        }
        default: {
          return null;
          break;
        }
      }
    } else {
      return null;
    }
  }

  readonly selectors = {
    lastPageButton:
    'div> div > div > nav > ul > li:last-child > a',

    offersLength: 'li.jobs-search-result-item',
    listPosition:
      'li.jobs-search-result-item:nth-child(INDEX) h3.listed-job-posting__title',
    listOfferLink: 'li.jobs-search-result-item:nth-child(INDEX) > a',
    listCompany:
      'li.jobs-search-result-item:nth-child(INDEX) h4.listed-job-posting__company',
    listCompanyLogo: 'li.jobs-search-result-item:nth-child(INDEX) img.listed-job-posting__image',
    listLocation:
      'li.jobs-search-result-item:nth-child(INDEX) p.listed-job-posting__location',
    listAddedDate:
      'li.jobs-search-result-item:nth-child(INDEX) span.posted-time-ago__text'
  };
}