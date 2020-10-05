export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
};

export const WaypointMode = {
  VIEW: `view`,
  EDIT: `edit`,
};

export const MouseKey = {
  LEFT: 0,
  WHEEL: 1,
  RIGHT: 2,
};

export const KeyboardKey = {
  ESCAPE: `Escape`,
  ENTER: `Enter`,
};

export const MAX_OFFERS_IN_VIEW_MODE = 3;

export const MAX_TOWN_IN_HEADER = 3;

export const defaultWaypoint = {
  price: 0,
  type: `Bus`,
  town: `Chamonix`,
  startTime: new Date(),
  endTime: new Date(),
};

export const SortType = {
  DEFAULT: `default`,
  TIME: `time`,
  PRICE: `price`,
};

export const FilterType = {
  DEFAULT: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const TOWNS = [];

export const TRANSFER_TYPES = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`];

export const TypeEmoji = new Map([
  [`Taxi`, `🚕`],
  [`Bus`, `🚌`],
  [`Train`, `🚂`],
  [`Ship`, `🚢`],
  [`Transport`, `🚆`],
  [`Drive`, `🚗`],
  [`Flight`, `✈️`],
  [`Check-in`, `🏨`],
  [`Sightseeing`, `🏛`],
  [`Restaurant`, `🍴`]
]);

export const ChartType = {
  MONEY: `MONEY`,
  TRANSPORT: `TRANSPORT`,
  TIME_SPENT: `TIME SPENT`,
};

export const MIN_IN_HOUR = 60;

export const HOURS_IN_DAY = 24;

export const DESTINATIONS_ALL = [];

export const DownloadStatus = {
  OK: `download all data`,
  ERROR: `not all data loaded`,
  FATAL_ERROR: `main data not load`,
};

export const PageType = {
  TABLE: `table`,
  STATS: `stats`,
};

export const ERROR_STYLE = `animation: shake 0.6s;`;

export const BAR_HEIGHT = 55;

export const WaypointAction = {
  REMOVE: `remove`,
  SAVE: `save`,
};
