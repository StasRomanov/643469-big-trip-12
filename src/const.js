export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const WaypointMode = {
  VIEW: `view`,
  EDIT: `edit`
};

export const MouseKey = {
  LEFT: 0,
  WHEEL: 1,
  RIGHT: 2
};

export const KeyboardKey = {
  ESCAPE: `Escape`,
  ENTER: `Enter`
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
