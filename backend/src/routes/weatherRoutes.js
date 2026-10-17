import express from 'express';
import {z} from 'zod';
import { getWeatherByCity, getWeatherByCoords } from '../services/weatherService.js';


const router = express.Router();


const querySchema = z.object({
    city: z
        .string({required_error: 'O nome da cidade é obrigatorio'})
        .min(2, 'O nome da cidade deve ter pelo menos 2 letras')
        .max(80, 'nome da cidade muito longo')
});


router.get('/weather', async (req, res) => {
    try{
        const {city} = querySchema.parse(req.query);

        const result = await getWeatherByCity(city);

        return res.json(result);

    }catch(error){
     
        if (error instanceof z.ZodError){
            return res.status(400).json({ error: error.issues[0].message });
        }


        if (error.message === 'CITY IS NOT FOUND'){
            return res.status(404).json({ error: 'Cidade não encontrada. Verifique a grafia'});
        }

        console.log('Erro interno:', error.message);
        return res.status(500).json({error: 'Erro ao buscar os dados meteorologicos.'});
    }
})


router.get('/weather/coords', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'Latitude e longitude são obrigatórias.' });

  try {
    const result = await getWeatherByCoords(lat, lon);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar clima pela localização.' });
  }
});

export default router
