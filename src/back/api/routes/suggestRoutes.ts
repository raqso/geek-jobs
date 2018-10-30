import * as express from 'express';
import { suggestController } from '../controllers/suggestController';

class SuggestRoutes {
    public router: express.Router = express.Router();
    constructor() {
      this.config();
    }

    private config(): void {
      this.router.get('/suggest', (req: express.Request, res: express.Response) => {
        if (req.query.position) {
            suggestController.positionSuggestions(req.query.position, req, res);
        }
        else if (req.query.location) {
            suggestController.locationSuggestions(req.query.location, req, res);
        }
        else {
          res.json(400);
        }
      });
    }
  }

export const suggestRoutes = new SuggestRoutes().router;