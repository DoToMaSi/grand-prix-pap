import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  effect,
  inject,
  viewChild,
} from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { HeroBackgroundService } from '@shared/services/hero-background.service';

const PAN_DURATION_MS = 6_000;
const ZOOM = 1.12;

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

  private readonly panA = viewChild<ElementRef<HTMLElement>>('panA');
  private readonly panB = viewChild<ElementRef<HTMLElement>>('panB');
  private readonly imgA = viewChild<ElementRef<HTMLImageElement>>('imgA');
  private readonly imgB = viewChild<ElementRef<HTMLImageElement>>('imgB');

  private readonly reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private activeAnimation: Animation | null = null;

  constructor() {
    afterNextRender(() => {
      this.startPan(this.bg.activeLayer());
      const intervalId = setInterval(() => this.bg.rotate(), PAN_DURATION_MS);
      this.destroyRef.onDestroy(() => {
        clearInterval(intervalId);
        this.cancelAllAnimations();
      });
    });

    effect(() => {
      const layer = this.bg.activeLayer();
      this.bg.backgroundA();
      this.bg.backgroundB();
      queueMicrotask(() => this.onLayerChange(layer));
    });
  }

  onImageReady(layer: 'a' | 'b'): void {
    if (this.bg.activeLayer() === layer) {
      this.startPan(layer);
    }
  }

  private onLayerChange(activeLayer: 'a' | 'b'): void {
    const inactive: 'a' | 'b' = activeLayer === 'a' ? 'b' : 'a';
    this.resetPan(inactive);
    this.startPan(activeLayer);
  }

  private startPan(layer: 'a' | 'b'): void {
    const panEl = this.getPan(layer);
    const imgEl = this.getImg(layer);
    if (!panEl || !imgEl?.complete || imgEl.naturalWidth === 0) return;

    const container = panEl.parentElement;
    if (!container) return;

    const containerW = container.clientWidth;
    const containerH = container.clientHeight;
    const scaledH = containerH * ZOOM;
    const scale = scaledH / imgEl.naturalHeight;
    const displayW = imgEl.naturalWidth * scale;
    const maxPan = Math.max(0, displayW - containerW);

    panEl.style.height = `${scaledH}px`;

    this.activeAnimation?.cancel();
    panEl.style.transform = 'translateY(-50%) translateX(0px)';

    if (this.reducedMotion || maxPan <= 0) return;

    this.activeAnimation = panEl.animate(
      [
        { transform: 'translateY(-50%) translateX(0px)' },
        { transform: `translateY(-50%) translateX(${-maxPan}px)` },
      ],
      { duration: PAN_DURATION_MS, easing: 'linear', fill: 'forwards' },
    );
  }

  private resetPan(layer: 'a' | 'b'): void {
    const panEl = this.getPan(layer);
    if (!panEl) return;
    panEl.getAnimations().forEach((a) => a.cancel());
    panEl.style.transform = 'translateY(-50%) translateX(0px)';
  }

  private cancelAllAnimations(): void {
    this.activeAnimation?.cancel();
    this.resetPan('a');
    this.resetPan('b');
  }

  private getPan(layer: 'a' | 'b'): HTMLElement | undefined {
    return layer === 'a' ? this.panA()?.nativeElement : this.panB()?.nativeElement;
  }

  private getImg(layer: 'a' | 'b'): HTMLImageElement | undefined {
    return layer === 'a' ? this.imgA()?.nativeElement : this.imgB()?.nativeElement;
  }
}
