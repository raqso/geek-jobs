import { Document} from 'mongoose';
export default interface Job extends Document {
    position: string;
    technologies?: string[];
    company?: string;
    companyLogo?: string;
    location: string;
    salary?: {from?: number, to?: number, currency?: string};
    link: string;
    addedDate?: Date | null;
    dateCrawled: Date;
    website: string;
    portalLogo?: string;
}