import { GetData } from '../GetData';

export default class NoFulffJobs implements Site {
    name = 'no fluff {jobs}';
    logoImage = 'https://nofluffjobs.com/images/logo_NFJ.png';
    address = 'https://nofluffjobs.com';
    endpointAddress = 'https://nofluffjobs.com/api/posting';

    async getJobs() {
        let jobOffers: Job[] = [];
        let result: NoFluffJobsResponse  = await GetData.getRequest(this.endpointAddress);
        result = result !== {} ? JSON.parse(result as string) : [];

        if (result && result.postings && result.postings.length) {
            result.postings.forEach((job) => {
                jobOffers.push(this.createJobOffer(job));
            });
        }

        return jobOffers;
    }

    private createJobOffer(job: Posting): Job {
        return {
            addedDate: new Date(job.posted),
            company: job.name,
            companyLogo: this.address + job.logo,
            dateCrawled: new Date(),
            link: this.address + '/' + job.url,
            location: job.essentials.mainLocation.city,
            position: `${job.title} ${job.level}`,
            salaryRange: { from: 0, to: 0, currency: '' },
            technology: ( job.technology ? [job.technology] : [] ),
            website: this.name,
            portalLogo: this.logoImage
        };
    }
}

export interface NoFluffJobsResponse {
    postings?: Posting[];
}

interface Posting {
    id:                     string;
    name:                   string;
    locationCount:          number;
    notRemoteLocationCount: number;
    essentials:             Essentials;
    posted:                 number;
    renewed?:               number;
    title:                  string;
    level:                  Level;
    technology?:            string;
    logo:                   string;
    category:               Category;
    remote:                 string;
    url:                    string;
    likes:                  number;
    referralBonus?:         number;
    referralBonusCurrency?: ReferralBonusCurrency;
}

enum Category {
    Backend = 'backend',
    BusinessAnalyst = 'businessAnalyst',
    BusinessIntelligence = 'businessIntelligence',
    Devops = 'devops',
    Frontend = 'frontend',
    Fullstack = 'fullstack',
    Mobile = 'mobile',
    Other = 'other',
    ProjectManager = 'projectManager',
    Support = 'support',
    Testing = 'testing',
    Trainee = 'trainee',
    UX = 'ux',
}

interface Essentials {
    mainLocation:    MainLocation;
    otherLocations?: OtherLocation[];
}

interface MainLocation {
    country:     Country;
    city:        string;
    street:      string;
    geoLocation: GeoLocation;
}

interface Country {
    code: Code;
    name: Name;
}

enum Code {
    Aus = 'AUS',
    Deu = 'DEU',
    Esp = 'ESP',
    Gbr = 'GBR',
    Irl = 'IRL',
    Lva = 'LVA',
    Nld = 'NLD',
    Nor = 'NOR',
    Pol = 'POL',
}

enum Name {
    Australia = 'Australia',
    Germany = 'Germany',
    Ireland = 'Ireland',
    Latvia = 'Latvia',
    Netherlands = 'Netherlands',
    Norway = 'Norway',
    Poland = 'Poland',
    Spain = 'Spain',
    UnitedKingdom = 'United Kingdom',
}

interface GeoLocation {
    latitude?:  number;
    longitude?: number;
}

interface OtherLocation {
    city:         string;
    street?:      string;
    geoLocation?: GeoLocation;
}

enum Level {
    Administrator = 'Administrator',
    Analyst = 'Analyst',
    Architect = 'Architect',
    Assistant = 'Assistant',
    Coordinator = 'Coordinator',
    Designer = 'Designer',
    Developer = 'Developer',
    Engineer = 'Engineer',
    Expert = 'Expert',
    Intern = 'Intern',
    Manager = 'Manager',
    Master = 'Master',
    Owner = 'Owner',
    Specialist = 'Specialist',
    Student = 'Student',
}

enum ReferralBonusCurrency {
    Eur = 'EUR',
    Pln = 'PLN',
}
