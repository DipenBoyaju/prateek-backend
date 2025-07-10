import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/dbconnect.js'
import cors from "cors"
import cookieParser from 'cookie-parser';
import authRoute from './routes/authRoute.js'
import researchRoute from './routes/researchRoute.js'
import teamRoute from './routes/teamRoute.js'
import eventRoute from './routes/eventRoute.js'
import mailRoute from './routes/mailRoute.js'
import newsRoute from './routes/newsRoute.js'
import galleryRoute from './routes/galleryRoute.js'
import newsletterRoute from './routes/newsletterRoute.js'
import projectRoute from './routes/projectRoute.js'
import subProjectRoute from './routes/subProjectRoute.js'

dotenv.config()
const app = express()

const PORT = process.env.PORT || 5000;

//for render
// const allowedOrigins = [
//   'http://prateekinnovations.com',
//   'https://prateekinnovations.com',
//   'http://www.prateekinnovations.com',
//   'https://www.prateekinnovations.com',
//   'https://prateek-1.vercel.app',
// ];

//forlocal
app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// for render
// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true // if you're using cookies or auth headers
// }));

app.use(express.json());
app.use(cookieParser());


app.use('/api', authRoute);
app.use('/api', researchRoute);
app.use('/api', teamRoute);
app.use('/api', eventRoute);
app.use('/api', mailRoute);
app.use('/api', newsRoute);
app.use('/api', galleryRoute);
app.use('/api', newsletterRoute);
app.use('/api', projectRoute);
app.use('/api', subProjectRoute);

app.get('/', (req, res) => {
  res.send('<h1>Welcome to my server</h1>');
});

app.get('/ping', (req, res) => {
  console.log(`[${new Date().toISOString()}] Cron ping received`);
  res.status(200).send('Pong from server');
});


connectDB()
  .then(
    () => {
      app.listen(PORT, () => {
        console.log('welcome to server')
      })
    }
  ).catch((err) => {
    console.error('Failed to connect to the database:', err);
  })

// const handler = async (req, res) => {
//   await connectDB()
//   return app(req, res)
// }

// export default handler
