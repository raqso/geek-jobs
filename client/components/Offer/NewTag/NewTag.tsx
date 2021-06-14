import React from "react";
import styles from "./NewTag.module.scss";
import newIcon from "../assets/newIcon.svg";

export const NewTag = () => {
  return (
    <div className={styles.newIcon}>
      <img src={newIcon} alt="New Tag" />
    </div>
  );
};
