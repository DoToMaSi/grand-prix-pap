export interface TeamEntry {
  id: string;
  team: string;
  previewPath: string;
}

export const TEAMS: TeamEntry[] = [
  { id: '1-ferrari', team: 'Scuderia Ferrari', previewPath: 'assets/car-previews/1-ferrari/preview.jpg' },
  { id: '2-mclaren', team: 'Mclaren Mercedes', previewPath: 'assets/car-previews/2-mclaren/preview.jpg' },
  { id: '3-williams', team: 'Williams BMW', previewPath: 'assets/car-previews/3-williams/preview.jpg' },
  { id: '4-sauber', team: 'Sauber Petronas', previewPath: 'assets/car-previews/4-sauber/preview.jpg' },
  { id: '5-jordan', team: 'Jordan Honda', previewPath: 'assets/car-previews/5-jordan/preview.jpg' },
  { id: '6-BAR', team: 'BAR Honda', previewPath: 'assets/car-previews/6-BAR/preview.jpg' },
  { id: '7-renault', team: 'Renault', previewPath: 'assets/car-previews/7-renault/preview.jpg' },
  { id: '8-jaguar', team: 'Jaguar Cosworth', previewPath: 'assets/car-previews/8-jaguar/preview.jpg' },
  { id: '9-arrows', team: 'Arrows Cosworth', previewPath: 'assets/car-previews/9-arrows/preview.jpg' },
  { id: '10-minardi', team: 'Minardi Asiatech', previewPath: 'assets/car-previews/10-minardi/preview.jpg' },
  { id: '11-toyota', team: 'Toyota', previewPath: 'assets/car-previews/11-toyota/preview.jpg' },
];
