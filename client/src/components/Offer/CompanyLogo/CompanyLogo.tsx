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
        src={src ? src : defaultLogo}
        alt={"Company logo"}
        className={styles.logo}
      />
    </div>
  );
};
