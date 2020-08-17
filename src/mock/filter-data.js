import {travelDays} from "./data";
import {shuffle} from "../util/data-function";

const shuffleWaypoints = (waypoints) => {
  let shuffleTravelDays = waypoints.slice();
  shuffleTravelDays.forEach((item) => {
    item.waypoints = shuffle(item.waypoints);
  });
  return shuffleTravelDays;
};

const getFutureWaypoints = (waypoints) => {
  let futureTravelDays = waypoints.slice();
  futureTravelDays.sort((a, b) => {
    const dateA = a.date;
    const dateB = b.date;
    const dateInMsA = Date.parse(dateA);
    const dateInMsB = Date.parse(dateB);
    if (dateInMsA < dateInMsB) {
      return 1;
    }
    if (dateInMsA > dateInMsB) {
      return -1;
    }
    return 0;
  });
  futureTravelDays.forEach((item) => {
    item.waypoints.sort((a, b) => {
      const dateA = a.startTime;
      const dateB = b.startTime;
      const dateInMsA = Date.parse(dateA);
      const dateInMsB = Date.parse(dateB);
      if (dateInMsA < dateInMsB) {
        return 1;
      }
      if (dateInMsA > dateInMsB) {
        return -1;
      }
      return 0;
    });
  });
  console.log(futureTravelDays);
};

export let everythingWaypoints = shuffleWaypoints(travelDays);
export let futureWaypoints = getFutureWaypoints(travelDays);

