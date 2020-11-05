import express from 'express'
import cors from 'cors'
import path from 'path'
import { errors } from 'celebrate'
import routes from './routes'
import { env } from './config';

const app = express()

app.use(cors())  // Release all
// app.use(cors({
//     origin: ['http://localhost:3333', 'http://localhosts']
// }))

app.use(express.json())

app.use(routes)

//Configure static routes
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads')))

// Used to return the errors generated by Celebrate Middleware
app.use(errors())

app.listen(env.port, () => {
    console.log(`Server started on port ${env.port}! 😎`);
})