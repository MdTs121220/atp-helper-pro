import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { adminLogin, generateATP, testAIEngine } from './controllers/atp.controller.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.post('/api/atp/generate', generateATP);
app.post('/api/ai/test', testAIEngine);
app.post('/api/admin/login', adminLogin);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
