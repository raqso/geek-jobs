import React from "react";
import { Story, Meta } from "@storybook/react";
import { Offer, OfferProps } from "../components/Offer/Offer";

export default {
  title: "Offer stories",
  component: Offer,
} as Meta;

const Template: Story<OfferProps> = (args: OfferProps) => <Offer {...args} />;

export const NewOffer = Template.bind({});
NewOffer.args = {
  companyLogo:
    "https://cdn.dribbble.com/users/31864/screenshots/3666062/free_logos_dribbble_ph.jpg?compress=1&resize=400x300",
  link: "https://geek-jobs.vercel.app/",
  position: "Software Tester",
  companyName: "Geek-Jobs Poland",
  tags: ["ENGLISH", "CI/CD", "JIRA", "AZURE DEVOPS"],
  salary: { from: 3000, to: 7000, currency: "PLN" },
  date: "2 days ago",
  location: "Wroclaw, PL",
  isNew: true,
};

export const OldOffer = Template.bind({});
OldOffer.args = {
  companyLogo:
    "https://cdn.dribbble.com/users/31864/screenshots/3666062/free_logos_dribbble_ph.jpg?compress=1&resize=400x300",
  link: "https://geek-jobs.vercel.app/",
  position: "JavaScript Developer",
  companyName: "Geek-Jobs Poland",
  tags: ["WEB DEVELOPMENT", "REACT", "TYPESCRIPT"],
  date: "2 days ago",
  salary: { from: 5000, to: 10000, currency: "PLN" },
  location: "Wroclaw, PL",
};

export const MinimalOffer = Template.bind({});
MinimalOffer.args = {
  position: "Scrum Master",
  link: "https://geek-jobs.vercel.app/",
  companyName: "Geek-Jobs Poland",
};
