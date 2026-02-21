import {Router, Request, Response} from "express";
import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { generateAccessToken, setRefreshTokenCookie } from '../lib/tokens';

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
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({error: 'Email and password are required'});
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
        return res.status(400).json({error: 'Email already in use'});
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
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

export default router;