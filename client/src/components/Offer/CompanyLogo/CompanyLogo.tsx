import React from "react";
import styles from "./CompanyLogo.module.scss";

type Props = {
  defaultLogo: string;
  src?: string;
  alt: string;
};

export const CompanyLogo = ({ src, defaultLogo, alt }: Props) => {
  return (
    <div className={styles.logoContainer}>
      <img src={src || defaultLogo} alt={alt} className={styles.logo} />
    </div>
  );
};
