import express, {Request, Response} from 'express';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';

require('dotenv').config();

import adminauth from './user/routes/auth'

const app = express();
app.use(cors());
// app.use(cors({origin: allowedDomains}))
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(compression())
app.use(cookieParser())

app.get("/", (req: express.Request, res: express.Response) =>{
    res.status(200).send("hello world")
})
app.use("/user", adminauth);
// app.use("/user/dashboard", authenticateToken, transactMoney);

app.listen(process.env.SEVERPORT, ()=>{
    console.log("Listening to port ", process.env.SEVERPORT);
})