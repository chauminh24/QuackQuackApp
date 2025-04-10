import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private apiKey = environment.weatherApiKey;
  private baseUrl = 'https://api.openweathermap.org/data/2.5';

  constructor(private http: HttpClient) {}

  async getCurrentWeather(lat: number, lon: number): Promise<any> {
    const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url).toPromise();
  }

  async getHourlyForecast(lat: number, lon: number): Promise<any> {
    const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
    return this.http.get(url).toPromise();
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