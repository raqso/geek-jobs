import React from "react";

import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import RoomIcon from "@material-ui/icons/Room";

import styles from "./OfferDetails.module.scss";
import { OfferProps } from "../Offer";

type Props = Pick<
  OfferProps,
  "position" | "companyName" | "tags" | "date" | "salary" | "location" | "isNew"
>;

export const OfferDetails = ({
  position,
  companyName,
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
        <div className={styles.company}>{companyName}</div>
      </div>

      <div className={styles.positionDescription}>
        {tags && (
          <div className={styles.tags}>
            {tags.map((tag) => (
              <div key={tag} className={styles.tag}>
                {tag}
              </div>
            ))}
          </div>
        )}

        <div className={styles.positionDetails}>
          {salary && (
            <div className={styles.salary}>{getNiceSalary(salary)}</div>
          )}

          {date && (
            <div className={styles.date}>
              <QueryBuilderIcon color="primary" />
              {date}
            </div>
          )}

          {location && (
            <div className={styles.location}>
              <RoomIcon color="secondary" />
              {location}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

type Salary = {
  from: number;
  to: number;
  currency: string;
};

export const getNiceSalary = (salary: Salary) => {
  if (!salary) {
    return "";
  }

  return `${salary.currency || ""} ${salary.from} - ${salary.to}`;
};
