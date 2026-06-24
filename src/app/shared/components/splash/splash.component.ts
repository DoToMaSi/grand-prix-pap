import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-splash',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.css',
})
export class SplashComponent {
  readonly finished = output<void>();

  protected readonly leaving = signal(false);

  onEnter(): void {
    if (this.leaving()) return;
    this.leaving.set(true);
  }

  onFadeOutEnd(event: TransitionEvent): void {
    if (event.propertyName !== 'opacity' || !this.leaving()) return;
    this.finished.emit();
  }
}
