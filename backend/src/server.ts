import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import authRouter from './routes/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Güvenlik ve Parse Middleware'leri
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/v1/auth',authRouter);

// Sağlık Kontrolü (Healthcheck) Endpoint'i
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Sunucu http://localhost:${PORT} üzerinde çalışıyor.`);
  console.log(`📌 Register Endpoint: POST http://localhost:${PORT}/api/v1/auth/register`);
});

export default app;