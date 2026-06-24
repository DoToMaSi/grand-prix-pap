import { Injectable, signal } from '@angular/core';
import { BACKGROUND_IMAGES } from '@core/config/backgrounds.config';

@Injectable({ providedIn: 'root' })
export class HeroBackgroundService {
  private readonly images = BACKGROUND_IMAGES;
  private currentIndex = 0;

  readonly backgroundA = signal(this.pickRandom());
  readonly backgroundB = signal(this.pickRandom());
  readonly activeLayer = signal<'a' | 'b'>('a');

  rotate(): void {
    const next = this.pickRandom();
    if (this.activeLayer() === 'a') {
      this.backgroundB.set(next);
      this.activeLayer.set('b');
    } else {
      this.backgroundA.set(next);
      this.activeLayer.set('a');
    }
  }

  private pickRandom(): string {
    if (this.images.length <= 1) return this.images[0];
    let next: number;
    do {
      next = Math.floor(Math.random() * this.images.length);
    } while (next === this.currentIndex);
    this.currentIndex = next;
    return this.images[next];
  }
}
