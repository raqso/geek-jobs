 
type Props = {
  from: number;
  to: number;
  currency: string;
};

export const getNiceSalary = (salary: Props) => {
    if (salary && salary.from && salary.to) {
        return `${salary.currency ? salary.currency : ""} ${salary.from} - ${
        salary.to
      } `;
    } else {
      return "";
    }
  };
  