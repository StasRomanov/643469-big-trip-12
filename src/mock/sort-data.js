const getOnlyWaypoints = (days) => {
  const sortWaypoints = [];
  days.forEach((item) => {
    item.waypoints.forEach((waypointsItem) => {
      sortWaypoints.push(waypointsItem);
    });
  });
  return sortWaypoints;
};

export const getTimeSortWaypoints = (waypoints) => {
  const sortTravelDays = waypoints.slice();
  const sortWaypoints = getOnlyWaypoints(sortTravelDays);
  sortWaypoints.sort((a, b) => {
    return b.differenceTimeMs - a.differenceTimeMs;
  });
  return sortWaypoints;
};

export const getPriceSortWaypoints = (waypoints) => {
  const sortTravelDays = waypoints.slice();
  const sortWaypoints = getOnlyWaypoints(sortTravelDays);
  sortWaypoints.sort((a, b) => {
    return b.price - a.price;
  });
  return sortWaypoints;
};
