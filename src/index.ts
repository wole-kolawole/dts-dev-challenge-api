import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './db/connection';

dotenv.config();

const port = process.env.PORT ? Number(process.env.PORT) : 4000;

async function start() {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Backend API listening on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
