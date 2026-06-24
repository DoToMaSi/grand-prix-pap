import { DestroyRef, Injectable, inject } from '@angular/core';
import { SFX_TARGET_SELECTOR } from '@core/config/sfx.config';
import { SfxService } from '@shared/services/sfx.service';

@Injectable({ providedIn: 'root' })
export class ButtonSfxService {
  private readonly sfx = inject(SfxService);

  bindGlobalListeners(destroyRef: DestroyRef): void {
    const onMouseOver = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const interactive = target.closest(SFX_TARGET_SELECTOR);
      if (!interactive || this.isDisabled(interactive)) return;

      const from = event.relatedTarget;
      if (from instanceof Node && interactive.contains(from)) return;

      this.sfx.hover();
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const interactive = target.closest(SFX_TARGET_SELECTOR);
      if (!interactive || this.isDisabled(interactive)) return;

      this.sfx.click();
    };

    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('click', onClick, true);

    destroyRef.onDestroy(() => {
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('click', onClick, true);
    });
  }

  private isDisabled(el: Element): boolean {
    if (el instanceof HTMLButtonElement || el instanceof HTMLInputElement) {
      return el.disabled;
    }
    return el.classList.contains('btn-disabled') || el.hasAttribute('disabled');
  }
}
