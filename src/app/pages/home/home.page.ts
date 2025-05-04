import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DetailedForecastComponent } from '../../components/detailed-forecast/detailed-forecast.component';
import { WeatherService } from '../../services/weather.service';
import { LocationService } from '../../services/location.service';
import { CycleService } from '../../services/cycle.service';
import { OvulationTrackerPage } from '../ovulation-tracker/ovulation-tracker.page';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AnimatedDuckComponent } from '../../components/animated-duck/animated-duck.component';
import { WeatherBackgroundComponent } from 'src/app/components/weather-background/weather-background.component';
import { SettingsPage } from '../settings/settings.page';
import { CycleSetupModalComponent } from 'src/app/components/cycle-setup-modal/cycle-setup-modal.component';

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
    private modalCtrl: ModalController,
    private cycleService: CycleService
  ) { }

  async ngOnInit() {
    this.updateTime();
    setInterval(() => this.updateTime(), 60000);

    try {
      // Attempt to get user's current location
      const position = await this.locationService.getCurrentLocation();
      const { latitude, longitude } = position.coords; // Access latitude and longitude from coords
      this.location = await this.locationService.getLocationName(latitude, longitude);

      // Fetch current weather
      this.currentWeather = await this.weatherService.getCurrentWeather(latitude, longitude);

      // Fetch hourly forecast
      const forecastData = await this.weatherService.getHourlyForecast(latitude, longitude);
      this.hourlyForecast = this.processHourlyForecast(forecastData);
    } catch (error) {
      console.error('Error loading weather data:', (error as any).message);

      // Handle location permission denial or other errors
      if ((error as any).message === 'User denied Geolocation') {
        this.location = 'Galway, Ireland'; // Default location if user denies geolocation
        await this.loadDefaultWeather();
      } else {
        this.location = 'Error retrieving location';
      }
    }
  }

  async loadDefaultWeather() {
    try {
      // Use Galway's coordinates for the default location
      const defaultLatitude = 53.2707; // Galway latitude
      const defaultLongitude = -9.0568; // Galway longitude

      // Fetch weather data for the default location
      this.currentWeather = await this.weatherService.getCurrentWeather(defaultLatitude, defaultLongitude);
      const forecastData = await this.weatherService.getHourlyForecast(defaultLatitude, defaultLongitude);
      this.hourlyForecast = this.processHourlyForecast(forecastData);
    } catch (error) {
      console.error('Error loading default weather data:', (error as any).message);
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
    console.log('openOvulationTracker called');

    try {
      await this.cycleService.init();
      const currentCycle = await this.cycleService.getCurrentCycle();
      console.log('Current cycle:', currentCycle);

      if (!currentCycle) {
        console.warn('No cycle data found. Prompting user.');
        const alert = document.createElement('ion-alert');
        alert.header = 'Cycle Not Set';
        alert.message = 'No menstrual cycle data found. Please go to settings to enter your cycle information.';
        alert.buttons = [
          {
            text: 'Go to Settings',
            handler: async () => {
              const modal = await this.modalCtrl.create({
                component: SettingsPage,
              });
              await modal.present();
            },
          },
          'Cancel'
        ];

        document.body.appendChild(alert);
        await alert.present();
        return;
      }

      // If data exists, open the tracker
      console.log('Opening Ovulation Tracker Page');
      const trackerModal = await this.modalCtrl.create({
        component: OvulationTrackerPage,
      });
      await trackerModal.present();

    } catch (error) {
      console.error('Error opening ovulation tracker:', error);
      const alert = document.createElement('ion-alert');
      alert.header = 'Error';
      alert.message = 'There was a problem accessing your cycle data. Please try again later.';
      alert.buttons = ['OK'];
      document.body.appendChild(alert);
      await alert.present();
    }
  }

  async openSettings() {
    const modal = await this.modalCtrl.create({
      component: SettingsPage,
    });
    await modal.present();
  }

  async openDetailedForecast() {
    try {
      const position = await this.locationService.getCurrentLocation();
      const { latitude, longitude } = position.coords;

      const currentWeather = await this.weatherService.getCurrentWeather(latitude, longitude);
      const hourlyForecastData = await this.weatherService.getHourlyForecast(latitude, longitude);
      const hourlyForecast = this.processHourlyForecast(hourlyForecastData);

      const dailyForecast = await this.weatherService.getDailyForecast(latitude, longitude);

      const weatherData = {
        current: currentWeather,
        hourly: hourlyForecast,
        daily: dailyForecast,
      };
      const apiKey = this.weatherService.getApiKey();
      const modal = await this.modalCtrl.create({
        component: DetailedForecastComponent,
        componentProps: {
          weatherData,
          location: this.location,
          currentCoords: {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          },
          apiKey,
        },
      });
      await modal.present();
    } catch (error) {
      console.error('Error opening detailed forecast:', error);
      // Show a user-friendly error message
      const alert = document.createElement('ion-alert');
      alert.header = 'Error';
      alert.message = 'Unable to load detailed forecast. Please try again later.';
      alert.buttons = ['OK'];
      document.body.appendChild(alert);
      await alert.present();
    }
  }
}