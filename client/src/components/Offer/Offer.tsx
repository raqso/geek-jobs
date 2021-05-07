import React from "react";

import { CompanyLogo } from "./CompanyLogo/CompanyLogo";
import { OfferDetails } from "./OfferDetails/OfferDetails";
import { NewTag } from "./NewTag/NewTag";

import styles from "./Offer.module.scss";

const defaultCompanyLogo =
  "https://www.gsr-technology.co.uk/wp-content/uploads/2015/10/partner-logo-placeholder-300x150.jpg";

export type OfferProps = {
  companyLogo?: string;
  link: string;
  position: string;
  companyName: string;
  tags?: string[];
  date?: string | Date;
  salary?: {
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
  companyName,
  salary,
  location,
  isNew,
  tags,
  date,
}: OfferProps) => {
  return (
    <a
      className={`${styles.offer} ${isNew ? styles.new : styles.old}`}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {isNew && <NewTag />}

      <CompanyLogo
        src={companyLogo}
        defaultLogo={defaultCompanyLogo}
        companyName={companyName}
      />

      <OfferDetails
        position={position}
        companyName={companyName}
        salary={salary}
        location={location}
        isNew={isNew}
        tags={tags}
        date={date}
      />
    </a>
  );
};
