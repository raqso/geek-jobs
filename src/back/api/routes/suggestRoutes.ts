import express, { Response, Request } from 'express';
import { suggestController } from '../controllers/suggestController';

class SuggestRoutes {
    public router = express.Router();
    constructor() {
      this.config();
    }

    private config(): void {
      this.router.get('/suggest', (req: Request, res: Response) => {
        const { position, location } = req.query;

        if (position) {
            suggestController.positionSuggestions(position.toString(), req, res);
        }
        else if (location) {
            suggestController.locationSuggestions(location.toString(), req, res);
        }
        else {
          res.json(400);
        }
      });
    }
  }

export const suggestRoutes = new SuggestRoutes().router;
