import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import config from './config';
import userRouter from './routes/users';

// Init variables
const port: string | number = process.env.PORT || 5000;
const app: express.Application = express();
const mongoDbUrl: string = config.MONGODB.URL || '';

// Mongoose initialization and connect to db;
mongoose
  .connect(mongoDbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log(`\n🚀 Database has connected \n`))
  .catch((err) => console.log(`\n💥 Failed to connect to datavase: ${err} \n`));

// App server setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/api/users', userRouter);

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Start server
app.listen(port, () => {
  console.log(`\n🚀 Server has started on port: ${port} \n`);
});
