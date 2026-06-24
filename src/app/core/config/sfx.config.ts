export const SFX = {
  hover: 'assets/sfx/hover.wav',
  click: 'assets/sfx/click.wav',
} as const;

/** Elements that should play UI sfx on hover/click. */
export const SFX_TARGET_SELECTOR =
  'button:not(:disabled):not(.btn-disabled), .btn:not([disabled]):not(.btn-disabled), .ctrl-btn, .player-tab';
