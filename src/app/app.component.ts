import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-root',
  template: '<ion-router-outlet></ion-router-outlet>',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {
  constructor(private renderer: Renderer2) {
    this.addGlobalMediaErrorHandler();
  }

  addGlobalMediaErrorHandler() {
    this.renderer.listen('window', 'error', (event: Event) => {
      const target = event.target as HTMLImageElement | HTMLVideoElement;

      if (target && (target.tagName === 'IMG' || target.tagName === 'VIDEO')) {
        if (!target.getAttribute('data-error-handled')) {
          target.setAttribute('data-error-handled', 'true'); // Prevent infinite loops
          if (target.tagName === 'IMG') {
            target.src = 'assets/images/fallback-image.png'; // Fallback image
          } else if (target.tagName === 'VIDEO') {
            target.src = 'assets/videos/fallback-video.png'; // Fallback video
          }
        }
      }
    });
  }
}
