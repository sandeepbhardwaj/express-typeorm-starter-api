import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Request, Response } from 'express';
import { AppDataSource } from './data-source';
import routes from './routes/index';
import { errorHandler } from './middlewares/ErrorHandler';

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    app.use(bodyParser.json());

    //Set all routes from routes folder
    app.use('/', routes);
    app.use(errorHandler);

    // setup express app here
    // ...

    // start express server
    app.listen(9090);

    console.log(
      'Express server has started on port 9090. Open http://localhost:9090/users to see results'
    );
  })
  .catch((error) => console.log(error));
