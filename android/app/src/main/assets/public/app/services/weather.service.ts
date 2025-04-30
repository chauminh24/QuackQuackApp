import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = environment.weatherApiKey;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private http: HttpClient) { }

  async getCurrentWeather(lat: number, lon: number): Promise<any> {
    const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url).toPromise();
  }

  async getHourlyForecast(lat: number, lon: number): Promise<any> {
    const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url).toPromise();
  }

  async getDailyForecast(lat: number, lon: number): Promise<any> {
    const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    const forecastData = await this.http.get<{ list: any[] }>(url).toPromise();

    if (!forecastData || !forecastData.list) {
      throw new Error('Invalid forecast data received');
    }

    // Process the 3-hour forecast data to extract daily summaries
    const dailySummaries: any[] = [];
    const groupedByDay: { [key: string]: any[] } = {};

    // Group forecast data by day
    forecastData.list.forEach((entry: any) => {
      const date = new Date(entry.dt * 1000).toLocaleDateString();
      if (!groupedByDay[date]) {
        groupedByDay[date] = [];
      }
      groupedByDay[date].push(entry);
    });

    // Process each day's data
    for (const date in groupedByDay) {
      const dayEntries = groupedByDay[date];
      const temps = dayEntries.map((entry: any) => entry.main.temp);
      const minTemp = Math.min(...temps);
      const maxTemp = Math.max(...temps);
      const condition = dayEntries[0].weather[0].description;
      const icon = dayEntries[0].weather[0].icon;

      dailySummaries.push({
        date,
        tempMin: Math.round(minTemp),
        tempMax: Math.round(maxTemp),
        condition,
        icon,
      });
    }

    return dailySummaries;
  }

  getWeatherBackground(weatherCode: number): string {
    if (weatherCode >= 200 && weatherCode < 300) {
      return 'thunderstorm-background';
    } else if (weatherCode >= 300 && weatherCode < 500) {
      return 'drizzle-background';
    } else if (weatherCode >= 500 && weatherCode < 600) {
      return 'rain-background';
    } else if (weatherCode >= 600 && weatherCode < 700) {
      return 'snow-background';
    } else if (weatherCode >= 700 && weatherCode < 800) {
      return 'atmosphere-background';
    } else if (weatherCode === 800) {
      return 'clear-sky-background';
    } else if (weatherCode > 800) {
      return 'cloudy-background';
    }
    return 'default-background'; // Fallback case
  }
}