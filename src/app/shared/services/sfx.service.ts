import { Injectable } from '@angular/core';
import { SFX } from '@core/config/sfx.config';

@Injectable({ providedIn: 'root' })
export class SfxService {
  private readonly volumes = { hover: 0.35, click: 0.45 };

  hover(): void {
    this.play(SFX.hover, this.volumes.hover);
  }

  click(): void {
    this.play(SFX.click, this.volumes.click);
  }

  private play(src: string, volume: number): void {
    const audio = new Audio(src);
    audio.volume = volume;
    audio.play().catch(() => {});
  }
}
