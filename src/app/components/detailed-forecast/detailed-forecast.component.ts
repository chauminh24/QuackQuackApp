import { Component, Input, OnInit } from '@angular/core';
import { ModalController, IonicModule } from '@ionic/angular';
import { WeatherConditionsComponent } from '../weather-conditions/weather-conditions.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-detailed-forecast',
  templateUrl: './detailed-forecast.component.html',
  styleUrls: ['./detailed-forecast.component.scss'],
  imports: [CommonModule, IonicModule],
})
export class DetailedForecastComponent implements OnInit {
  @Input() weatherData: any; // Full weather data passed from the parent
  @Input() location!: string; // Location name passed from the parent

  hourlyForecast: any[] = []; // Processed hourly forecast data
  dailyForecast: any[] = []; // Processed daily forecast data

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    if (this.weatherData) {
      this.weatherData.current.main.temp = Math.round(this.weatherData.current.main.temp);      this.hourlyForecast = this.weatherData.hourly;
      this.dailyForecast = this.weatherData.daily;
    } else {
      console.error('Weather data is missing.');
    }
  }

  // Extract and process hourly and daily forecasts
  extractForecasts() {
    if (this.weatherData) {
      // Process hourly forecast
      this.hourlyForecast = this.weatherData.hourly.map((hour: any) => ({
        time: new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        icon: this.mapWeatherIcon(hour.weather[0].icon),
        temp: Math.round(hour.temp),
      }));

      // Process daily forecast
      this.dailyForecast = this.weatherData.daily.map((day: any) => ({
        date: new Date(day.dt * 1000).toLocaleDateString([], { weekday: 'long' }),
        icon: this.mapWeatherIcon(day.weather[0].icon),
        tempMin: Math.round(day.temp.min),
        tempMax: Math.round(day.temp.max),
        condition: day.weather[0].description,
      }));
    }
  }

  // Map OpenWeatherMap icon codes to Ionicons or custom icons
  mapWeatherIcon(iconCode: string): string {
    const iconMap: { [key: string]: string } = {
      '01d': 'sunny',
      '01n': 'moon',
      '02d': 'partly-sunny',
      '02n': 'cloudy-night',
      '03d': 'cloudy',
      '03n': 'cloudy',
      '04d': 'cloudy',
      '04n': 'cloudy',
      '09d': 'rainy',
      '09n': 'rainy',
      '10d': 'rainy',
      '10n': 'rainy',
      '11d': 'thunderstorm',
      '11n': 'thunderstorm',
      '13d': 'snow',
      '13n': 'snow',
      '50d': 'cloudy',
      '50n': 'cloudy',
    };
    return iconMap[iconCode] || 'help-circle'; // Default icon
  }

  // Open a modal for detailed weather conditions
  async openWeatherConditions() {
    const modal = await this.modalCtrl.create({
      component: WeatherConditionsComponent,
      componentProps: {
        weatherData: this.weatherData,
      },
    });
    await modal.present();
  }

  // Dismiss the modal
  dismiss() {
    this.modalCtrl.dismiss();
  }
}