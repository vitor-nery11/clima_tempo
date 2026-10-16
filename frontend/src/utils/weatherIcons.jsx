import { Sun, Cloud, CloudRain, CloudLightning, Snowflake, CloudDrizzle} from 'lucide-react';

export function getWeatherInfo(code){

    if (code===0 ){
        return {label: 'Céu limpo', icon: <Sun className='w-12 h-12 text-yellow-400'/>}
    }

    if (code >= 1 && code <= 3) {
    return { label: 'Nublado', icon: <Cloud className="w-12 h-12 text-gray-300" /> };
    }
  
    if (code >= 51 && code <= 57) {
        return { label: 'Garoa', icon: <CloudDrizzle className="w-12 h-12 text-blue-300" /> };
    }

    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) {
        return { label: 'Chuva', icon: <CloudRain className="w-12 h-12 text-blue-400" /> };
    }

    if (code >= 71 && code <= 77) {
        return { label: 'Neve', icon: <Snowflake className="w-12 h-12 text-cyan-200" /> };
    }

    if (code >= 95) {
        return { label: 'Tempestade', icon: <CloudLightning className="w-12 h-12 text-purple-400" /> };
    }

    // Padrão caso venha algum código diferente
  return { label: 'Variável', icon: <Cloud className="w-12 h-12 text-gray-300" /> };
  
}