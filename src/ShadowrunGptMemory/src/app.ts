import express from 'express';
import mongoose from 'mongoose';
import { setUserRoutes } from './routes/userRoutes';
import { setCampaignRoutes } from './routes/campaignRoutes';
import { setSessionRoutes } from './routes/sessionRoutes';
import { setCharacterRoutes } from './routes/characterRoutes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/shadowrungpt', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
setUserRoutes(app);
setCampaignRoutes(app);
setSessionRoutes(app);
setCharacterRoutes(app);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});