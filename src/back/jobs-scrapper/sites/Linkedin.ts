import Job from '../Job';
import ScrappedSite from '../ScrappedSite';

export default class Linkedin extends ScrappedSite {
  readonly name = 'Linkedin';
  readonly address = 'https://linkedin.com';
  readonly logoImage =
    'https://pl.linkedin.com/scds/common/u/images/logos/linkedin/logo_linkedin_white_text_blue_inbug_312x80_v1.png';
  readonly endpointAddress =
    `https://pl.linkedin.com/jobs/search?locationId=pl&f_F=it`;

  protected async isLastPage() {
    const pagesLimit = 15;
    if (this.pageNumber <= pagesLimit) {
      const lastButtonText = this.cherrioInstance(this.selectors.lastPageButton).text();
      return Number(lastButtonText) === this.pageNumber;
    }
    else {
      return true;
    }
  }

  protected async getJobsForThePage() {
    let jobOffers: Job[] = [];

    this.cherrioInstance(this.selectors.offersLength).find('li.jobs-search-result-item').each( (_index, element) => {
      const position = this.cherrioInstance(element).find(this.selectors.position).text();
      const offerLink = this.cherrioInstance(element).find('a').attr('href');
      const location = this.cherrioInstance(element).find(this.selectors.location).text().trim();
      const addedDate = this.cherrioInstance(element).find(this.selectors.addedDate).text();
      const company = this.cherrioInstance(element).find(this.selectors.company).text();
      const companyLogo = this.cherrioInstance(element).find(this.selectors.companyLogo).attr('data-delayed-url');

      jobOffers.push({
        addedDate: this.getOfferDate(addedDate),
        dateCrawled: new Date(),
        link: offerLink,
        location: this.getCityName(location),
        position: position,
        company: company,
        companyLogo: companyLogo,
        website: this.name,
        portalLogo: this.logoImage
      } as Job);
    });

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

  private getCityName(location: string) {
    if (location && location.split(',').length) {
      return location.split(',')[0];
    }
    else {
      return '';
    }
  }

  protected readonly selectors = {
    lastPageButton:
    'div> div > div > nav > ul > li:last-child > a',
    offersLength: 'ul.jobs-search-content__results',
    position:
      '.listed-job-posting__title',
    company:
      '.listed-job-posting__company',
    companyLogo: 'img.listed-job-posting__image',
    location:
      '.listed-job-posting__location',
    addedDate:
      '.posted-time-ago__text'
  };
}