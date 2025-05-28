import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/dbconnect.js'
import cors from "cors"
import authRoute from './routes/authRoute.js'
import researchRoute from './routes/researchRoute.js'
import teamRoute from './routes/teamRoute.js'
import eventRoute from './routes/eventRoute.js'
import mailRoute from './routes/mailRoute.js'

dotenv.config()
const app = express()

app.use(cors({
  origin: 'http://localhost:5173',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.use(express.json());


app.use('/api', authRoute);
app.use('/api', researchRoute);
app.use('/api', teamRoute);
app.use('/api', eventRoute);
app.use('/api', mailRoute);

connectDB()
  .then(
    () => {
      app.listen(process.env.PORT, () => {
        console.log('welcome to server')
      })
    }
  ).catch((err) => {
    console.error('Failed to connect to the database:', err);
  })

app.use('/', (req, res) => {
  res.send('<h1>welcom to my server</h1>')
})