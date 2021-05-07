import React from "react";
import { Story, Meta } from "@storybook/react";
import { Offer, Props } from "../components/Offer/Offer";

export default {
  title: "Offer stories",
  component: Offer,
} as Meta;

const Template: Story<Props> = (args: Props) => <Offer {...args} />;

export const NewOffer = Template.bind({});
NewOffer.args = {
  companyLogo:
    "https://cdn.dribbble.com/users/31864/screenshots/3666062/free_logos_dribbble_ph.jpg?compress=1&resize=400x300",
  position: "Software Tester",
  company: "Geek-Jobs Poland",
  salary: { from: 3000, to: 7000, currency: "PLN" },
  location: "Wroclaw, PL",
  link: "https://geek-jobs.vercel.app/",
  tags: ["English", "CI/CD", "JIRA", "Azure DevOps"],
  date: "2 days ago",
  isNew: true,
};

export const OldOffer = Template.bind({});
OldOffer.args = {
  companyLogo:
    "https://cdn.dribbble.com/users/31864/screenshots/3666062/free_logos_dribbble_ph.jpg?compress=1&resize=400x300",
  position: "JavaScript Developer",
  company: "Geek-Jobs Poland",
  salary: { from: 5000, to: 10000, currency: "PLN" },
  location: "Wroclaw, PL",
  link: "https://geek-jobs.vercel.app/",
  tags: ["WEB DEVELOPMENT", "REACT", "TYPESCRIPT"],
  date: "2 days ago",
};
