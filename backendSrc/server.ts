import express, { Express, Request, Response } from 'express';
import { router as userRouter } from './routes/users.js';
import { router as channelRouter } from './routes/channel.js';
import { router as messageRouter} from './routes/message.js'
import { getUserData, validateUser } from './config/users.js';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app: Express = express();
const port: number = Number(process.env.PORT || 4242);
const { sign, verify } = jwt;

interface Payload {
    userId: ObjectId;
    iat: number;
}

app.use('/', express.static('dist/'));
app.use(express.json());
app.use(cors());

// Router middleware
app.use('/api/users', userRouter);
app.use('/api/channels', channelRouter)
app.use('/api/messages', messageRouter)

// POST /login
app.post('/api/login', async (req: Request, res: Response) => {
    try {
        if (!process.env.SECRET) {
            res.sendStatus(500);
            return;
        }

        const userId = await validateUser(req.body.username, req.body.password);

        if (!userId) {
            res.status(401).json({ error: "Unauthorized", message: "You are not authorized" });
            return;
        }

        const payload: Payload = { userId, iat: Math.floor(Date.now() / 1000) };
        const token = sign(payload, process.env.SECRET as string);

        res.json({ jwt: token });
        return;
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
        return;
    }
});

// GET /protected

app.get('/protected', async (req: Request, res: Response) => {
    if (!process.env.SECRET) {
        res.sendStatus(500);
		return
    }

    const token = req.headers.authorization;
    console.log('Header: ', token);
    if (!token) {
         res.sendStatus(401);
		 return
    }

    let payload: Payload;
    try {
        payload = verify(token, process.env.SECRET) as Payload;
        console.log('Payload: ', payload);
    } catch (error) {
        console.error('Token verification error:', error);
        res.sendStatus(400);
		return
    }

    const userId: ObjectId = new ObjectId(payload.userId);
    try {
        const user = await getUserData(userId);
        console.log('User fetched:', user);
        if (!user) {
            console.error('User not found for ID:', userId);
            res.sendStatus(404);
			return 
        }

        res.json(user);
		return
    } catch (error) {
        console.error('Error fetching user:', error);
        res.sendStatus(500);
		return 
    }
});


app.listen(port, () => {
    console.log(`Server is listening on port ${port}...`);
});