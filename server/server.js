import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoute from './routes/userRoute.js';
import internshipRoute from './routes/internshipRoute.js';

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Read MongoDB URI from env
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined. Check server/.env');
  process.exit(1);
}

console.log('Connecting to MongoDB...');

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("Connected host:", mongoose.connection.host);
    console.log("Connected DB:", mongoose.connection.name);
    console.log("MONGODB_URI (sanitized):", process.env.MONGODB_URI?.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:***@"));
    console.log('✅ Connected to MongoDB successfully');
    console.log(
      `📊 Database: ${mongoose.connection.host} / ${mongoose.connection.name}`
    );
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  });

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoute);
app.use('/api/internships', internshipRoute);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
