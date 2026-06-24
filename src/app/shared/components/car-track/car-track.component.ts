import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TEAMS } from '@core/config/teams.config';

@Component({
  selector: 'app-car-track',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  templateUrl: './car-track.component.html',
  styleUrl: './car-track.component.css',
})
export class CarTrackComponent {
  protected readonly teams = TEAMS;
}
