import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-animated-duck',
  templateUrl: './animated-duck.component.html',
  styleUrls: ['./animated-duck.component.scss'],
})
export class AnimatedDuckComponent implements OnChanges {
  @Input() weatherCondition!: string; // Input to accept the weather condition
  duckImage: string = 'assets/images/default-duck.gif'; // Default duck image

  ngOnChanges() {
    this.updateDuckImage();
  }

  updateDuckImage() {
    switch (this.weatherCondition?.toLowerCase()) {
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