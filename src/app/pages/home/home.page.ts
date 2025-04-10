// home.page.ts
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetailedForecastComponent } from '../../components/detailed-forecast/detailed-forecast.component';
import { WeatherService } from '../../services/weather.service';
import { LocationService } from '../../services/location.service';
import { OvulationTrackerPage } from '../ovulation-tracker/ovulation-tracker.page';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AnimatedDuckComponent } from '../../components/animated-duck/animated-duck.component';
import { WeatherBackgroundComponent } from 'src/app/components/weather-background/weather-background.component';
import { SettingsPage } from '../settings/settings.page';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AnimatedDuckComponent,
    WeatherBackgroundComponent
  ]
})
export class HomePage implements OnInit {
  currentWeather: any;
  hourlyForecast: any[] = [];
  location: string = 'Loading...';
  currentTime: string = '';
  isPanelExpanded = false;

  constructor(
    private weatherService: WeatherService,
    private locationService: LocationService,
    private modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 60000);

    try {
      // Get user's current location
      const coords = await this.locationService.getCurrentLocation();
      this.location = await this.locationService.getLocationName(coords.latitude, coords.longitude);

      // Fetch current weather
      this.currentWeather = await this.weatherService.getCurrentWeather(coords.latitude, coords.longitude);

      // Fetch hourly forecast
      const forecastData = await this.weatherService.getHourlyForecast(coords.latitude, coords.longitude);
      this.hourlyForecast = this.processHourlyForecast(forecastData);
    } catch (error) {
      console.error('Error loading weather data:', error);
    }
  }

  updateTime() {
    this.currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  processHourlyForecast(forecastData: any): any[] {
    // Extract hourly forecast data (e.g., next 12 hours)
    return forecastData.list.slice(0, 12).map((entry: any) => ({
      time: new Date(entry.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      icon: this.mapWeatherIcon(entry.weather[0].icon),
      temp: Math.round(entry.main.temp),
    }));
  }
  mapWeatherIcon(iconCode: string): string {
    // Map OpenWeatherMap icon codes to Ionicons or custom icons
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
  
  togglePanel() {
    this.isPanelExpanded = !this.isPanelExpanded;
  }

  async openOvulationTracker() {
    const modal = await this.modalCtrl.create({
      component: OvulationTrackerPage
    });
    await modal.present();
  }

  async openSettings() {
    const modal = await this.modalCtrl.create({
      component: SettingsPage,
    });
    await modal.present();
  }

  async openDetailedForecast() {
    const modal = await this.modalCtrl.create({
      component: DetailedForecastComponent,
      componentProps: {
        weatherData: this.currentWeather,
        location: this.location
      }
    });
    await modal.present();
  }
}