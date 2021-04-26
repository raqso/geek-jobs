import express, { Response, Request } from 'express';
import { offersController } from '../controllers/offersController';
import { suggestController } from '../controllers/suggestController';

class OffersRoutes {
  public router = express.Router();
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
        if (req.query && Object.entries(req.query).length) {
          const notEmptyParams = this.filterEmptyParams(req.query);
          offersController.offers(notEmptyParams, req, res);
        } else {
          offersController.allOffers(req, res);
        }
      }
    );

    this.router.get('/test', (req: Request, res: Response) =>
      offersController.testOffers(req, res)
    );

    this.router.get(
      '/suggest',
      (req: Request, res: Response) => {
        const { position, location } = req.query;

        if (position) {
          suggestController.positionSuggestions(position.toString(), req, res);
        } else if (location) {
          suggestController.locationSuggestions(location.toString(), req, res);
        } else {
          res.json(400);
        }
      }
    );
  }

  filterEmptyParams(parameters: any) {
    const filteredParameters = Object.assign(parameters);
    Object.entries(parameters).forEach(([key, value]) => {
      if (!value || value === {}) {
        delete filteredParameters[key];
      }
    });

    return filteredParameters;
  }
}

export const offersRoutes = new OffersRoutes().router;
