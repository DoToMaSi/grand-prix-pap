import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MiniPlayerComponent } from '@shared/components/mini-player/mini-player.component';
import { SplashComponent } from '@shared/components/splash/splash.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { HeroComponent } from '@shared/components/hero/hero.component';
import { CarTrackComponent } from '@shared/components/car-track/car-track.component';
import { SignupComponent } from '@shared/components/signup/signup.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { MusicPlayerService } from '@shared/services/music-player.service';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SplashComponent,
    MiniPlayerComponent,
    HeaderComponent,
    HeroComponent,
    CarTrackComponent,
    SignupComponent,
    FooterComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly entered = signal(false);
  private readonly musicPlayer = inject(MusicPlayerService);

  onEnter(): void {
    this.entered.set(true);
    this.musicPlayer.startPlayback();
  }
}
