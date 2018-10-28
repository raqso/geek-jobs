import * as React from 'react';

interface OfferProps {
  link: string;
  position: string;
  location?: string;
  company?: string;
  companyLogo?: string;
  addedDate?: Date;
  portalImage?: string;
  salary: {
    from: number;
    to: number;
    currency: string;
  };
}

export class Offer extends React.Component<OfferProps, any> {
  private readonly defaultCompanyLogo = 'https://www.gsr-technology.co.uk/wp-content/uploads/2015/10/partner-logo-placeholder-300x150.jpg';
  public render() {
    return (
      <li className={'offer'}>
        <a href={this.props.link}>
          <div className={'company-logo'}>
            <img src={this.props.companyLogo ? this.props.companyLogo : this.defaultCompanyLogo} alt={'Company logo'} />
          </div>
          <div className={'offer-content'}>
            <p className={'position'}>{this.props.position}</p>
            <span className="location">{this.props.location}</span>{' '}
            {this.getNiceDate(this.props.addedDate)}
          </div>
          <div className={'salary'}>
            {this.getNiceSalary(this.props.salary)}
          </div>
          <div className={'portal-logo'}>
            <img src={this.props.portalImage} alt={'Job offers portal logo'} />
          </div>
        </a>
      </li>
    );
  }

  private getNiceDate(dateObj?: Date) {
    if (dateObj) {
      const day = dateObj.getDate();
      const month = dateObj.getMonth() + 1;
      const year = dateObj.getFullYear();

      return `${day}.${month}.${year}`;
    } else {
      return '';
    }
  }

  private getNiceSalary(salary: {
    from: number;
    to: number;
    currency: string;
  }) {
    if (salary && salary.from && salary.to) {
      return `${salary.from} - ${salary.to}${salary.currency}`;
    } else {
      return '';
    }
  }
}
