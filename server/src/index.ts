import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import routes from './routes';
import { backupDB } from './controllers';

backupDB();

const app = express();
const port = 3001;

app.use(express.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  optionsSuccessStatus: 200,
  credentials: true
};
app.use(cors(corsOptions));
app.use('/api', routes);

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});


export default app;


