import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MusicPlayerService } from '@shared/services/music-player.service';

@Component({
  selector: 'app-mini-player',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  templateUrl: './mini-player.component.html',
  styleUrl: './mini-player.component.css',
})
export class MiniPlayerComponent {
  protected readonly player = inject(MusicPlayerService);

  get volume(): number {
    return this.player.volume();
  }
  set volume(v: number) {
    this.player.setVolume(+v);
  }

  onSeek(event: Event): void {
    this.player.seek(+(event.target as HTMLInputElement).value);
  }

  onVolumeChange(): void {
    this.player.setVolume(this.player.volume());
  }
}
