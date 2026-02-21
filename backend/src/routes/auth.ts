import {Router, Request, Response} from "express";
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { generateAccessToken, setRefreshTokenCookie } from '../lib/tokens';
import {requireAuth} from '../middlewares/requireAuth';
import jwt from "jsonwebtoken";

const router = Router()

router.post('/login', async (req: Request, res: Response) => {
 
 try{
    const {email, password} = req.body;

  if (!email || !password) {
    return res.status(400).json({error: 'Email and password are required'});
  }

  async function getUser(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  const user = await getUser(email);

  if (!user) {
    return res.status(401).json({error: 'Invalid credentials'});
  }

  const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);

  if (!isPasswordValid) {
    return res.status(401).json({error: 'Invalid credentials'});
  }

   const accessToken = generateAccessToken(user.id);
  setRefreshTokenCookie(res, user.id);

  const { hashedPassword: _, ...safeUser } = user;

  res.status(200).json({
    accessToken, 
    user: safeUser,
  });

  }catch(error){
    console.error(error);
    return res.status(500).json({error: 'Internal server error'});
  }

});

router.post('/register', async (req: Request, res: Response) => {
  try{
    const {email, username, password} = req.body;

    if (!email || !username || !password) {
        return res.status(400).json({error: 'Email, username and password are required'});
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        return res.status(400).json({error: 'Email already in use'});
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        hashedPassword,
      },
    });

    const { hashedPassword: _, ...safeUser } = newUser;

    res.status(201).json({ user: safeUser });
  }catch(error){
    console.error(error);
    return res.status(500).json({error: 'Internal server error'});
  }
});

router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,    
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});


router.get('/me', requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, username: true },
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/refresh', async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token is required' });
    }
    const userId = await new Promise<number>((resolve, reject) => {
      jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!, undefined, (err, decoded) => {
        if (err) {
            reject(err);
        } else {
            resolve((decoded as jwt.JwtPayload).userId as number);
        }
        }
    );
    }
);

    const accessToken = generateAccessToken(userId);
    setRefreshTokenCookie(res, userId);
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid or expired refresh token' });
  }
});

export default router;