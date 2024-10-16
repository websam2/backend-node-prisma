import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use((req, res, next) => {
  res.header('Set-Cookie', '__vercel_live_token=; SameSite=None; Secure');
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'Seja bem-vindo ao backend de Node com Prisma' });
});

app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Não foi possível criar o usuário' });
  }
});

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

const PORT = process.env.PORT || 3000;

async function main() {
  try {
    await prisma.$connect();
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Não foi possível conectar ao banco de dados', error);
    process.exit(1);
  }
}

main();