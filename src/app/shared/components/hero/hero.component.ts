import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { cssBackgroundUrl } from '@core/utils/css-background-url';
import { HeroBackgroundService } from '@shared/services/hero-background.service';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
})
export class HeroComponent implements OnInit {
  protected readonly bg = inject(HeroBackgroundService);
  protected readonly cssUrl = cssBackgroundUrl;
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    const intervalId = setInterval(() => this.bg.rotate(), 6_000);
    this.destroyRef.onDestroy(() => clearInterval(intervalId));
  }
}
