import React from "react";

import { Logo } from "./Logo";
import { OfferDetails } from "./OfferDetails";
import { NewTag } from "./NewTag";

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
  return (
    <a
      className={isNew ? styles.offer + " " + styles.isNew : styles.offer}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {isNew && <NewTag />}

      <Logo companyLogo={companyLogo} />

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
