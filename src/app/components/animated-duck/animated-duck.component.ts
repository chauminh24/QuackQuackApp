import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-animated-duck',
  templateUrl: './animated-duck.component.html',
  styleUrls: ['./animated-duck.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonicModule
  ]
})
export class AnimatedDuckComponent implements OnChanges {
  @Input() weatherCondition!: string; // Input for weather
  @Input() ovulationPhase!: string;   // Input for menstrual cycle phase
  duckImage: string = 'assets/images/default-duck.png'; // Default duck

  ngOnChanges() {
    this.updateDuckImage();
  }

  updateDuckImage() {
    if (this.ovulationPhase) {
      this.updateDuckByPhase();
    } else if (this.weatherCondition) {
      this.updateDuckByWeather();
    } else {
      this.duckImage = 'assets/images/default-duck.png'; // Fallback
    }
  }

  updateDuckByPhase() {
    const phase = this.ovulationPhase.toLowerCase();
    console.log('Updating duck for phase:', phase);

    const phaseDuckMap: { [key: string]: string } = {
      'menstruation': 'assets/images/menstruation-duck.png',
      'follicular': 'assets/images/follicular-duck.png',
      'ovulation': 'assets/images/ovulation-duck.png',
      'luteal': 'assets/images/luteal-duck.png'
    };

    this.duckImage = phaseDuckMap[phase] || 'assets/images/default-duck.png';
  }

  updateDuckByWeather() {
    const weather = this.weatherCondition.toLowerCase();
    console.log('Updating duck for weather:', weather);

    const weatherDuckMap: { [key: string]: string } = {
      'rain': 'assets/images/rain-duck.png',
      'clear': 'assets/images/sunny-duck.png',
      'clouds': 'assets/images/cloudy-duck.png',
      'snow': 'assets/images/snow-duck.png',
      'thunderstorm': 'assets/images/thunderstorm-duck.png'
    };

    this.duckImage = weatherDuckMap[weather] || 'assets/images/default-duck.png';
  }
}
