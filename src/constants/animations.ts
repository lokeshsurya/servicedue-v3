// Animation constants
export const ANIMATION_DURATION = {
    FAST: 0.4,
    NORMAL: 0.6,
    SLOW: 1,
    VERY_SLOW: 2
} as const

export const ANIMATION_DELAY = {
    NONE: 0,
    SHORT: 0.1,
    MEDIUM: 0.2,
    LONG: 0.3,
    VERY_LONG: 0.5
} as const

export const ANIMATION_EASING = {
    EASE_OUT: "easeOut",
    EASE_IN_OUT: "easeInOut",
    EASE_IN: "easeIn"
} as const

// Phone mockup constants
export const PHONE_CONFIG = {
    TILT_DEGREES: 6,
    OFFSET_X: -160,
    OFFSET_X_INITIAL: -120,
    ENTRANCE_Y: 20,
    MAX_WIDTH_MOBILE: 320,
    MAX_WIDTH_DESKTOP: 360
} as const

// SVG decoration constants
export const SVG_DECORATION = {
    WIDTH_PERCENT: 180,
    HEIGHT_PERCENT: 180,
    TOP_OFFSET_PERCENT: -40,
    LEFT_OFFSET_PERCENT: -40,
    ROTATION: -15,
    SCALE: 1.2
} as const

// Message animation delays
export const MESSAGE_DELAYS = {
    FIRST: 0.8,
    SECOND: 1.5,
    THIRD: 2.2
} as const

// Grid configuration
export const GRID_CONFIG = {
    LEFT_COLUMNS: 5,
    RIGHT_COLUMNS: 7,
    RIGHT_START_COLUMN: 7
} as const
