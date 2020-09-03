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
