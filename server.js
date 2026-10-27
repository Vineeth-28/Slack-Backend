import express from 'express';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Standard Built-in Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Health Check Route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date() });
});

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 Express server successfully running on port ${PORT}`);
});
