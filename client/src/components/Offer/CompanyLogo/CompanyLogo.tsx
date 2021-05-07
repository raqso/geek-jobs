import React from "react";
import styles from "./CompanyLogo.module.scss";

type Props = {
  defaultLogo: string;
  src?: string;
  companyName: string;
};

export const CompanyLogo = ({ src, defaultLogo, companyName }: Props) => {
  return (
    <div className={styles.logoContainer}>
      <img
        src={src || defaultLogo}
        alt={`${companyName} logo`}
        className={styles.logo}
      />
    </div>
  );
};
