interface Job {
    position: string;
    technology?: string[];
    company: string;
    companyLogo?: string;
    location: string;
    salaryRange?: {from?: number, to?: number, currency?: string};
    link: string;
    addedDate?: Date | null;
    dateCrawled: Date;
    website: string;
}