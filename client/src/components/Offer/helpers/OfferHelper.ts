type Salary = {
  from: number;
  to: number;
  currency: string;
};

export const getNiceSalary = (salary: Salary) => {
  if (salary?.from && salary?.to) {
    return `${salary.currency || ""} ${salary.from} - ${salary.to}`;
  }

  if (salary) {
    return "";
  }
};
