import Job from './Job';
export default interface Site {
    name: string;
    logoImage: string;
    address: string;
    endpointAddress: string;
    getJobs(): Job[] | Promise<Job[]>;
}