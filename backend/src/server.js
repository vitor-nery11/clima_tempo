import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weatherRoutes.js'

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 30, //maximo 30 buscas por minuto
    message: {error: 'Muitas buscas seguidas. Aguarde um minuto e tente novamente'}

});

app.use('/api', limiter);

app.use('/api', weatherRoutes);


app.listen(PORT, () => {
    console.log(`Backend rodando em http://localhost:${PORT}`)
})






export default app 