// detailed-forecast.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { WeatherConditionsComponent } from '../weather-conditions/weather-conditions.component';

@Component({
  selector: 'app-detailed-forecast',
  templateUrl: './detailed-forecast.component.html',
  styleUrls: ['./detailed-forecast.component.scss'],
})
export class DetailedForecastComponent implements OnInit {
  @Input() weatherData: any;
  @Input() location!: string; //not sure

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {}

  async openWeatherConditions() {
    const modal = await this.modalCtrl.create({
      component: WeatherConditionsComponent,
      componentProps: {
        weatherData: this.weatherData
      }
    });
    await modal.present();
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}