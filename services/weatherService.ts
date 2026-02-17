
import { WeatherData } from '../types';

// This will be updated once the user provides the API key and URL
const WEATHER_API_KEY = process.env.WEATHER_API_KEY || '';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';

export interface RituData {
    season: 'Summer' | 'Winter' | 'Monsoon';
    dominantDosha: 'Pitta' | 'Vata' | 'Kapha';
    avoidProperty: string;
    message: string;
    icon: string;
}

export const determineRitu = (temp: number, humidity: number, condition: string): RituData => {
    const cond = condition.toLowerCase();

    // MONSOON (Varsha – Vata Aggravation)
    if (humidity >= 75 && (cond.includes('rain') || cond.includes('cloud') || cond.includes('storm'))) {
        return {
            season: 'Monsoon',
            dominantDosha: 'Vata',
            avoidProperty: 'Cold & Raw',
            message: 'High moisture disturbs digestion. Avoid raw and cold foods.',
            icon: '🌧️'
        };
    }

    // WINTER (Hemanta/Shishira – Kapha Season)
    if (temp <= 20) {
        return {
            season: 'Winter',
            dominantDosha: 'Kapha',
            avoidProperty: 'Heavy',
            message: 'Cold weather increases Kapha. Avoid heavy and oily foods.',
            icon: '❄️'
        };
    }

    // SUMMER (Grishma – Pitta Season)
    // Fallback to summer if hot or default
    if (temp >= 32 && humidity < 75) {
        return {
            season: 'Summer',
            dominantDosha: 'Pitta',
            avoidProperty: 'Heating',
            message: 'High heat increases Pitta. Avoid heating herbs and spicy foods.',
            icon: '☀️'
        };
    }

    // Default Fallback (Spring/Neutral transition)
    return {
        season: temp > 25 ? 'Summer' : 'Winter',
        dominantDosha: temp > 25 ? 'Pitta' : 'Vata',
        avoidProperty: temp > 25 ? 'Heating' : 'Cooling',
        message: 'Transition season. Maintain balance with neutral properties.',
        icon: '🌾'
    };
};

export const getWeatherData = async (lat: number, lon: number): Promise<WeatherData & { ritu: RituData }> => {
    try {
        if (!WEATHER_API_KEY) throw new Error("Weather API Key missing");

        const response = await fetch(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
        const data = await response.json();

        if (!response.ok) throw new Error(data.message || "Failed to fetch weather");

        const temp = data.main.temp;
        const humidity = data.main.humidity;
        const condition = data.weather[0].main;

        const ritu = determineRitu(temp, humidity, condition);

        return {
            temp,
            humidity,
            description: data.weather[0].description,
            city: data.name,
            season: ritu.season,
            ritu
        };
    } catch (error) {
        console.error("Weather Service Error:", error);
        const ritu = determineRitu(25, 50, 'Clear');
        return {
            temp: 25,
            humidity: 50,
            description: "Cloudy",
            city: "Unknown",
            season: ritu.season,
            ritu
        };
    }
};
