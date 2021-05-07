import React from "react";

import { CompanyLogo } from "./CompanyLogo/CompanyLogo";
import { OfferDetails } from "./OfferDetails/OfferDetails";
import { NewTag } from "./NewTag/NewTag";

import styles from "./Offer.module.scss";

export type Props = {
  companyLogo?: string;
  link: string;
  position: string;
  company: string;
  tags?: string[];
  date?: string | Date;
  salary: {
    from: number;
    to: number;
    currency: string;
  };
  location?: string;
  isNew?: boolean;
};

export const Offer = ({
  link,
  companyLogo,
  position,
  company,
  salary,
  location,
  isNew,
  tags,
  date,
}: Props) => {
  const defaultCompanyLogo =
    "https://www.gsr-technology.co.uk/wp-content/uploads/2015/10/partner-logo-placeholder-300x150.jpg";

  return (
    <a
      className={isNew ? styles.offer + " " + styles.isNew : styles.offer}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {isNew && <NewTag />}

      <CompanyLogo src={companyLogo} defaultLogo={defaultCompanyLogo} />

      <OfferDetails
        position={position}
        company={company}
        salary={salary}
        location={location}
        isNew={isNew}
        tags={tags}
        date={date}
      />
    </a>
  );
};
