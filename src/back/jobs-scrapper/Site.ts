interface Site {
    name: string;
    logoImage: string;
    address: string;
    endpointAddress: string;
    getJobs(position?: string, location?: string, technology?: string[]): Job[] | Promise<Job[]>;
}