import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-animated-duck',
  templateUrl: './animated-duck.component.html',
  styleUrls: ['./animated-duck.component.scss'],
})
export class AnimatedDuckComponent implements OnChanges {
  @Input() weatherCondition!: string; // Input to accept the weather condition
  @Input() ovulationPhase!: string; // New input for the ovulation phase
  duckImage: string = 'assets/images/default-duck.gif'; // Default duck image

  ngOnChanges() {
    this.updateDuckImage();
  }

  updateDuckImage() {
    if (this.ovulationPhase) {
      // Update duck image based on ovulation phase
      switch (this.ovulationPhase.toLowerCase()) {
        case 'menstruation':
          this.duckImage = 'assets/images/menstruation-duck.gif';
          break;
        case 'follicular':
          this.duckImage = 'assets/images/follicular-duck.gif';
          break;
        case 'ovulation':
          this.duckImage = 'assets/images/ovulation-duck.gif';
          break;
        case 'luteal':
          this.duckImage = 'assets/images/luteal-duck.gif';
          break;
        default:
          this.duckImage = 'assets/images/default-duck.gif'; // Fallback image
          break;
      }
    } else if (this.weatherCondition) {
      // Update duck image based on weather condition
      switch (this.weatherCondition.toLowerCase()) {
        case 'rain':
          this.duckImage = 'assets/images/rain-duck.gif';
          break;
        case 'clear':
          this.duckImage = 'assets/images/sunny-duck.gif';
          break;
        case 'clouds':
          this.duckImage = 'assets/images/cloudy-duck.gif';
          break;
        case 'snow':
          this.duckImage = 'assets/images/snow-duck.gif';
          break;
        case 'thunderstorm':
          this.duckImage = 'assets/images/thunderstorm-duck.gif';
          break;
        default:
          this.duckImage = 'assets/images/default-duck.gif'; // Fallback image
          break;
      }
    }
  }
}