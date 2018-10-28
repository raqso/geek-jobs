import * as express from 'express';
import { offersController } from '../controllers/offersController';

class OffersRoutes {

    public router: express.Router = express.Router();
    constructor() {
      this.config();
    }

    private config(): void {
      this.router.get('/', (req: express.Request, res: express.Response) =>
        offersController.root(req, res)
      );
      this.router.get('/offers', (req: express.Request, res: express.Response) =>
        offersController.allOffers(req, res)
      );
      this.router.get('/test', (req: express.Request, res: express.Response) =>
      offersController.testOffers(req, res)
    );
    }
  }

export const offersRoutes = new OffersRoutes().router;