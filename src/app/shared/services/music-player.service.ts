import { DestroyRef, Injectable, Signal, computed, inject, signal } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PLAYLIST } from '@core/config/music.config';

export interface TrackMeta {
  title: string;
  artist: string;
  album: string;
  coverUrl: string | null;
}

@Injectable({ providedIn: 'root' })
export class MusicPlayerService {
  private static readonly VOLUME_KEY = 'gppMiniPlayerVolume';

  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);

  private readonly bgMusic = new Audio();
  private rafId = 0;
  private peekTimer: ReturnType<typeof setTimeout> | null = null;
  private loadGeneration = 0;
  private activeCoverBlobUrl: string | null = null;

  private readonly onFirstInteraction = () => {
    this.bgMusic.play().catch(() => {});
    document.removeEventListener('click', this.onFirstInteraction);
    document.removeEventListener('keydown', this.onFirstInteraction);
  };

  private readonly shuffledPlaylist = this.shuffle([...PLAYLIST]);
  private readonly currentIndex = signal(0);
  private readonly trackMeta = signal<TrackMeta>({ title: '', artist: '', album: '', coverUrl: null });

  private readonly _isPlaying = signal(false);
  readonly isPlaying: Signal<boolean> = this._isPlaying.asReadonly();

  readonly isOpen = signal(false);
  readonly isLoadingMeta = signal(true);

  readonly displayTitle = computed(() => {
    const { title } = this.trackMeta();
    if (!title) {
      const path = this.shuffledPlaylist[this.currentIndex()];
      return path.split('/').pop()?.replace(/\.mp3$/i, '') ?? path;
    }
    return title;
  });
  readonly displayArtist = computed(() => this.trackMeta().artist);
  readonly displayAlbum = computed(() => this.trackMeta().album);
  readonly displayCoverUrl = computed<SafeUrl | null>(() => {
    const url = this.trackMeta().coverUrl;
    return url ? this.sanitizer.bypassSecurityTrustUrl(url) : null;
  });

  private readonly _volume = signal(
    parseFloat(localStorage.getItem(MusicPlayerService.VOLUME_KEY) ?? '0.25')
  );
  readonly volume: Signal<number> = this._volume.asReadonly();

  readonly progress = signal(0);
  readonly elapsed = signal('0:00');
  readonly duration = signal('0:00');

  constructor() {
    this.bgMusic.volume = this._volume();
    this.bgMusic.addEventListener('loadedmetadata', () => {
      this.duration.set(this.formatTime(this.bgMusic.duration));
    });
    this.bgMusic.addEventListener('play', () => {
      this._isPlaying.set(true);
      this.tick();
      this.peek();
    });
    this.bgMusic.addEventListener('pause', () => this._isPlaying.set(false));
    this.bgMusic.addEventListener('ended', () => {
      this._isPlaying.set(false);
      this.next(true);
    });

    this.loadTrack(0, false);

    this.destroyRef.onDestroy(() => {
      cancelAnimationFrame(this.rafId);
      if (this.peekTimer !== null) clearTimeout(this.peekTimer);
      if (this.activeCoverBlobUrl) URL.revokeObjectURL(this.activeCoverBlobUrl);
      document.removeEventListener('click', this.onFirstInteraction);
      document.removeEventListener('keydown', this.onFirstInteraction);
      this.bgMusic.pause();
    });
  }

  startPlayback(): void {
    setTimeout(() => {
      this.bgMusic.muted = true;
      this.bgMusic
        .play()
        .then(() => {
          this.bgMusic.muted = false;
        })
        .catch(() => {
          this.bgMusic.muted = false;
          document.addEventListener('click', this.onFirstInteraction, { once: true });
          document.addEventListener('keydown', this.onFirstInteraction, { once: true });
        });
    }, 500);
  }

  next(autoplay = false): void {
    const nextIndex = (this.currentIndex() + 1) % this.shuffledPlaylist.length;
    this.loadTrack(nextIndex, autoplay || this.isPlaying());
  }

  previous(): void {
    if (this.bgMusic.currentTime > 3) {
      this.bgMusic.currentTime = 0;
      return;
    }
    const prevIndex =
      (this.currentIndex() - 1 + this.shuffledPlaylist.length) % this.shuffledPlaylist.length;
    this.loadTrack(prevIndex, this.isPlaying());
  }

  toggleMusic(): void {
    if (this.isPlaying()) {
      this.bgMusic.pause();
    } else {
      this.bgMusic.play();
    }
  }

  stopMusic(): void {
    this.bgMusic.pause();
    this.bgMusic.currentTime = 0;
    this.progress.set(0);
    this.elapsed.set('0:00');
  }

  toggleOpen(): void {
    if (this.peekTimer !== null) {
      clearTimeout(this.peekTimer);
      this.peekTimer = null;
    }
    this.isOpen.update((v) => !v);
  }

  setVolume(value: number): void {
    this._volume.set(value);
    this.bgMusic.volume = value;
    localStorage.setItem(MusicPlayerService.VOLUME_KEY, String(value));
  }

  seek(value: number): void {
    this.bgMusic.currentTime = (value / 100) * (this.bgMusic.duration || 0);
    this.progress.set(value);
  }

  private async loadTrack(index: number, autoplay: boolean): Promise<void> {
    const generation = ++this.loadGeneration;
    this.currentIndex.set(index);
    const src = this.shuffledPlaylist[index];
    this.bgMusic.src = src;
    this.progress.set(0);
    this.elapsed.set('0:00');
    this.duration.set('0:00');
    if (this.activeCoverBlobUrl) {
      URL.revokeObjectURL(this.activeCoverBlobUrl);
      this.activeCoverBlobUrl = null;
    }
    this.trackMeta.set({ title: '', artist: '', album: '', coverUrl: null });
    this.isLoadingMeta.set(true);

    const meta = await this.readId3Tags(src);
    if (generation !== this.loadGeneration) {
      if (meta.coverUrl) URL.revokeObjectURL(meta.coverUrl);
      return;
    }
    this.activeCoverBlobUrl = meta.coverUrl;
    this.trackMeta.set(meta);
    this.isLoadingMeta.set(false);
    if (autoplay) this.bgMusic.play().catch(() => {});
  }

  private async readId3Tags(url: string): Promise<TrackMeta> {
    const empty: TrackMeta = { title: '', artist: '', album: '', coverUrl: null };
    try {
      const res = await fetch(url, { headers: { Range: 'bytes=0-524287' } });
      const buf = await res.arrayBuffer();
      const bytes = new Uint8Array(buf);
      const view = new DataView(buf);

      if (bytes[0] !== 0x49 || bytes[1] !== 0x44 || bytes[2] !== 0x33) return empty;

      const version = bytes[3];
      const tagSize =
        ((bytes[6] & 0x7f) << 21) |
        ((bytes[7] & 0x7f) << 14) |
        ((bytes[8] & 0x7f) << 7) |
        (bytes[9] & 0x7f);

      let offset = 10;
      const result: TrackMeta = { title: '', artist: '', album: '', coverUrl: null };

      while (offset + 10 <= Math.min(tagSize + 10, buf.byteLength)) {
        const frameId = String.fromCharCode(
          bytes[offset],
          bytes[offset + 1],
          bytes[offset + 2],
          bytes[offset + 3]
        );
        if (frameId[0] === '\0') break;

        const frameSize =
          version === 4
            ? ((bytes[offset + 4] & 0x7f) << 21) |
              ((bytes[offset + 5] & 0x7f) << 14) |
              ((bytes[offset + 6] & 0x7f) << 7) |
              (bytes[offset + 7] & 0x7f)
            : view.getUint32(offset + 4);

        offset += 10;
        if (offset + frameSize > buf.byteLength) break;

        if ((frameId === 'TIT2' || frameId === 'TPE1' || frameId === 'TALB') && frameSize > 0) {
          const encoding = bytes[offset];
          const slice = bytes.slice(offset + 1, offset + frameSize);
          let text = '';
          if (encoding === 0) text = new TextDecoder('latin1').decode(slice);
          else if (encoding === 3) text = new TextDecoder('utf-8').decode(slice);
          else if (encoding === 1) {
            const hasBom = slice[0] === 0xff && slice[1] === 0xfe;
            text = new TextDecoder('utf-16le').decode(slice.slice(hasBom ? 2 : 0));
          } else if (encoding === 2) {
            text = new TextDecoder('utf-16be').decode(slice);
          }
          text = text.replace(/\0/g, '').trim();
          if (frameId === 'TIT2') result.title = text;
          else if (frameId === 'TPE1') result.artist = text;
          else result.album = text;
        }

        if (frameId === 'APIC' && frameSize > 0 && !result.coverUrl) {
          const encoding = bytes[offset];
          let mimeEnd = offset + 1;
          while (mimeEnd < offset + frameSize && bytes[mimeEnd] !== 0) mimeEnd++;
          const mimeType = new TextDecoder('latin1').decode(bytes.slice(offset + 1, mimeEnd));
          let dataStart = mimeEnd + 2;
          if (encoding === 1 || encoding === 2) {
            while (
              dataStart + 1 < offset + frameSize &&
              !(bytes[dataStart] === 0 && bytes[dataStart + 1] === 0)
            )
              dataStart += 2;
            dataStart += 2;
          } else {
            while (dataStart < offset + frameSize && bytes[dataStart] !== 0) dataStart++;
            dataStart++;
          }
          const imageBytes = bytes.slice(dataStart, offset + frameSize);
          const blob = new Blob([imageBytes], { type: mimeType || 'image/jpeg' });
          result.coverUrl = URL.createObjectURL(blob);
        }

        offset += frameSize;
      }

      return result;
    } catch {
      return empty;
    }
  }

  private peek(): void {
    if (this.isOpen()) return;
    this.isOpen.set(true);
    this.peekTimer = setTimeout(() => {
      this.isOpen.set(false);
      this.peekTimer = null;
    }, 3000);
  }

  private tick(): void {
    this.rafId = requestAnimationFrame(() => {
      const cur = this.bgMusic.currentTime;
      const dur = this.bgMusic.duration || 0;
      this.progress.set(dur ? (cur / dur) * 100 : 0);
      this.elapsed.set(this.formatTime(cur));
      if (this.isPlaying()) this.tick();
    });
  }

  private formatTime(s: number): string {
    if (!isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${sec}`;
  }

  private shuffle(arr: string[]): string[] {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
}
