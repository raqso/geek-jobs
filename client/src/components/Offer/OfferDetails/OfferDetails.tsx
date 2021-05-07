import React from "react";
import styles from "./OfferDetails.module.scss";
import { getNiceSalary } from "../helpers/OfferHelper";

type Props = {
  position: string;
  company: string;
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

export const OfferDetails = ({
  position,
  company,
  salary,
  location,
  isNew,
  tags,
  date,
}: Props) => {
  return (
    <div className={styles.detailsContainer}>
      <div className={styles.positionAndCompany}>
        <div className={styles.position}>{position}</div>
        <div className={styles.company}>{company}</div>
      </div>

      <div className={styles.positionDescription}>
        {tags && (
          <div className={styles.tags}>
            {tags.map((tag, index) => {
              return (
                <div key={index} className={styles.tag}>
                  {tag}
                </div>
              );
            })}
          </div>
        )}

        <div className={styles.positionDetails}>
          {salary && (
            <div className={styles.salary}>{getNiceSalary(salary)}</div>
          )}

          {date && (
            <div className={styles.date}>
              <svg width="24px" height="24px" viewBox="0 0 24 24">
                <path d="M16.24 7.76C15.07 6.59 13.54 6 12 6v6l-4.24 4.24c2.34 2.34 6.14 2.34 8.49 0 2.34-2.34 2.34-6.14-.01-8.48zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"></path>
              </svg>
              {date}
            </div>
          )}

          {location && (
            <div className={styles.location}>
              <svg width="24px" height="24px" viewBox="0 0 24 24">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 4.17 4.42 9.92 6.24 12.11.4.48 1.13.48 1.53 0C14.58 18.92 19 13.17 19 9c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"></path>
              </svg>
              {location}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
