"use client";

import { useState, FormEvent } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon, MapPinIcon, ThermometerIcon } from "lucide-react";

interface WeatherData {
    temperature: number;
    description: string;
    location: string;
    unit: string;
}

export default function WeatherWidget() {
    const [location, setLocation] = useState<string>("");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const trimmedLocation = location.trim();
        if (trimmedLocation === "") {
            setError("Please Enter a Valid Location");
            setWeather(null);
            return;
        }
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
            );
            if (!response.ok) {
                throw new Error("Not Found.");
            }
            const data = await response.json();
            const weatherData: WeatherData = {
                temperature: data.current.temp_c,
                description: data.current.condition.text,
                location: data.location.name,
                unit: "C",
            };
            setWeather(weatherData);
        } catch {
            setError("Not found. Please Try Again.");
            setWeather(null);
        } finally {
            setIsLoading(false);
        }
    };

    function getTemperatureMessage(temperature: number, unit: string): string {
        if (unit === "C") {
            if (temperature < 0) {
                return `It's freezing at ${temperature}°C! Bundle up!`;
            } else if (temperature < 10) {
                return `It's quite cold at ${temperature}°C! Wear Warm Clothes.`;
            } else if (temperature < 20) {
                return `The temperature is ${temperature}°C. Comfortable for a Light Jacket.`;
            } else if (temperature < 30) {
                return `It's a pleasant ${temperature}°C. Enjoy the nice weather!`;
            } else {
                return `It's hot at ${temperature}°C. Stay hydrated!`;
            }
        } else {
            return `${temperature}°${unit}`;
        }
    }

    function getWeatherMessage(description: string): string {
        switch (description.toLocaleLowerCase()) {
            case "sunny":
                return "It's a Beautiful Sunny Day!";
            case "partly cloudy":
                return "Expect some Clouds and Sunshine.";
            case "cloudy":
                return "It's cloudy today.";
            case "overcast":
                return "The sky is Overcast.";
            case "rain":
                return "Don't forget your Umbrella! It's raining.";
            case "thunderstorm":
                return "Thunderstorms are expected today.";
            case "snow":
                return "Bundle up! It's Snowing.";
            case "mist":
                return "It's misty outside.";
            case "fog":
                return "Be careful, there's fog outside.";
            default:
                return description;
        }
    }

    function getLocationMessage(location: string): string {
        const currentHour = new Date().getHours();
        const isNight = currentHour >= 18 || currentHour < 6;
        return `${location} ${isNight ? "at Night" : "During the Day"}`;
    }

    return (
        <div className="flex justify-center items-center h-screen bg-teal-50">
            <Card className="w-full max-w-md mx-auto text-center shadow-lg bg-teal-50 rounded-lg p-4">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-teal-950 p-2">Weather Widget Project<br/>By Muniza Nabeel</CardTitle>
                    <CardDescription className="text-teal-900 ">
                        Search for the Current Weather Conditions in your City.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="flex items-center gap-2 mt-4">
                        <Input
                            type="text"
                            placeholder="Enter a City Name"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="border-2 border-teal-300 rounded-lg p-2 w-full"
                        />
                        <Button
                            type="submit"
                            className="bg-teal-400 text-white hover:bg-teal-700 active:bg-teal-900 rounded-lg px-4 py-2 transition-all"
                            disabled={isLoading}
                        >
                            {isLoading ? "Loading..." : "Search"}
                        </Button>
                    </form>
                    {error && <div className="mt-4 text-red-500">{error}</div>}
                    {weather && (
                        <div className="mt-6 space-y-2">
                            <div className="flex items-center gap-2 text-lg">
                                <ThermometerIcon className="w-6 h-6 text-red-400" />
                                {getTemperatureMessage(weather.temperature, weather.unit)}
                            </div>
                            <div className="flex items-center gap-2 text-lg">
                                <CloudIcon className="w-6 h-6 text-blue-400" />
                                {getWeatherMessage(weather.description)}
                            </div>
                            <div className="flex items-center gap-2 text-lg">
                                <MapPinIcon className="w-6 h-6 text-green-400" />
                                {getLocationMessage(weather.location)}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
