import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  afterNextRender,
  inject,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HeroBackgroundService } from '@shared/services/hero-background.service';

const SLIDE_DURATION_MS = 6_000;

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent {
  protected readonly bg = inject(HeroBackgroundService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      const intervalId = setInterval(() => this.bg.rotate(), SLIDE_DURATION_MS);
      this.destroyRef.onDestroy(() => clearInterval(intervalId));
    });
  }
}
