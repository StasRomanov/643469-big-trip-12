import moment from "moment";

export const getTimeSortWaypoints = (waypoints) => {
  const sortWaypoints = waypoints.slice();
  sortWaypoints.sort((a, b) => {
    return b.differenceTimeMs - a.differenceTimeMs;
  });
  return sortWaypoints;
};

export const getPriceSortWaypoints = (waypoints) => {
  const sortWaypoints = waypoints.slice();
  sortWaypoints.sort((a, b) => {
    return b.price - a.price;
  });
  return sortWaypoints;
};

export const getDefaultSortWaypoints = (waypoints) => {
  const sortWaypoints = waypoints.slice();
  sortWaypoints.sort((a, b) => {
    return moment(a.startTime).format(`x`) - moment(b.startTime).format(`x`);
  });
  return sortWaypoints;
};
