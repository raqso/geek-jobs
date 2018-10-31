import * as express from 'express';
import { offersController } from '../controllers/offersController';
import { suggestController } from '../controllers/suggestController';

class OffersRoutes {
  public router: express.Router = express.Router();
  constructor() {
    this.config();
  }

  private config(): void {
    this.router.get('/', (req: express.Request, res: express.Response) =>
      offersController.root(req, res)
    );
    this.router.get(
      '/offers',
      (req: express.Request, res: express.Response) => {
        if (req.query.position || req.query.location) {
          offersController.offers(req.query.position, req.query.location, req, res);
        } else {
          offersController.allOffers(req, res);
        }
      }
    );

    this.router.get('/test', (req: express.Request, res: express.Response) =>
      offersController.testOffers(req, res)
    );

    this.router.get(
      '/suggest',
      (req: express.Request, res: express.Response) => {
        if (req.query.position) {
          suggestController.positionSuggestions(req.query.position, req, res);
        } else if (req.query.location) {
          suggestController.locationSuggestions(req.query.location, req, res);
        } else {
          res.json(400);
        }
      }
    );
  }
}

export const offersRoutes = new OffersRoutes().router;
