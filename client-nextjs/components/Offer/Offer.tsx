import React from "react";

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

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

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#03a9f4",
    },
    secondary: {
      main: "#ffc400",
    },
  },
});

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
    <ThemeProvider theme={theme}>
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
          alt={companyName}
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
    </ThemeProvider>
  );
};
