import React from "react";
import styles from "./CompanyLogo.module.scss";

type Props = {
  defaultLogo: string;
  src?: string;
};

export const CompanyLogo = ({ src, defaultLogo }: Props) => {
  return (
    <div className={styles.logoContainer}>
      <img
        src={src || defaultLogo}
        alt={src || defaultLogo}
        className={styles.logo}
      />
    </div>
  );
};
