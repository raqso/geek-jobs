import React from "react";
import styles from "./Offer.module.scss";

type Props = {
  companyLogo?: string;
};

const defaultCompanyLogo =
  "https://www.gsr-technology.co.uk/wp-content/uploads/2015/10/partner-logo-placeholder-300x150.jpg";

export const Logo = ({ companyLogo }: Props) => {
  return (
    <div className={styles.logoContainer}>
      <img
        src={companyLogo ? companyLogo : defaultCompanyLogo}
        alt={"Company logo"}
        className={styles.logo}
      />
    </div>
  );
};
