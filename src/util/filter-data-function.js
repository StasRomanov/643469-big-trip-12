import moment from "moment";

export const getFutureWaypointsFilter = (waypoints) => {
  return waypoints.slice().filter((waypoint) => {
    return moment(waypoint.startTime).format(`x`) - moment(new Date()).format(`x`) > 0;
  });
};

export const getPastWaypointsFilter = (waypoints) => {
  return waypoints.slice().filter((waypoint) => {
    return moment(new Date()).format(`x`) - moment(waypoint.startTime).format(`x`) > 0;
  });
};
