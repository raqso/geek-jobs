import express from 'express';
import * as bodyParser from 'body-parser';
import { offersRoutes } from './routes/offersRoutes';
import mongoose from 'mongoose';

class Api {
    public app: express.Application;
    public readonly mongoUrl: string = 'mongodb://localhost/jobs';

    constructor() {
        this.mongoSetup();
        this.app = express();
        this.config();
    }

    private mongoSetup(): void {
        (<any>mongoose).Promise = global.Promise;
        mongoose.connect(this.mongoUrl, { useNewUrlParser: true });
    }

    private config(): void {

        this.app.use(bodyParser.json());

        this.app.use(bodyParser.urlencoded({
            extended: false
        }));

        this.app.use('/api', offersRoutes);
    }
}

export default new Api().app;