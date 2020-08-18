import {travelDays} from "./data";
import {shuffle} from "../util/data-function";

const getOnlyWaypoints = (days) => {
  let sortWaypoints = [];
  days.forEach((item) => {
    item.waypoints.forEach((waypointsItem) => {
      sortWaypoints.push(waypointsItem);
    });
  });
  return sortWaypoints;
};

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
};

const getNameSortWaypoints = (waypoints) => {
  let sortTravelDays = waypoints.slice();
  let sortWaypoints = getOnlyWaypoints(sortTravelDays);
  sortWaypoints.sort((a, b) => {
    let typeA = a.type.toLowerCase();
    let typeB = b.type.toLowerCase();
    if (typeA < typeB) {
      return -1;
    }
    if (typeA > typeB) {
      return 1;
    }
    return 0;
  });
  return sortWaypoints;
};

const getTimeSortWaypoints = (waypoints) => {
  let sortTravelDays = waypoints.slice();
  let sortWaypoints = getOnlyWaypoints(sortTravelDays);
  sortWaypoints.sort((a, b) => {
    return b.differenceTimeMs - a.differenceTimeMs;
  });
  return sortWaypoints;
};

const getPriceSortWaypoints = (waypoints) => {
  let sortTravelDays = waypoints.slice();
  let sortWaypoints = getOnlyWaypoints(sortTravelDays);
  sortWaypoints.sort((a, b) => {
    return b.price - a.price;
  });
  return sortWaypoints;
};

const getOffersSortWaypoints = (waypoints) => {
  let usedCountA = 0;
  let usedCountB = 0;
  let sortTravelDays = waypoints.slice();
  let sortWaypoints = getOnlyWaypoints(sortTravelDays);
  sortWaypoints.sort((a, b) => {
    a.bonusOptions.forEach((item) => {
      if (item.used) {
        usedCountA++;
      }
    });
    b.bonusOptions.forEach((item) => {
      if (item.used) {
        usedCountB++;
      }
    });
    return usedCountB - usedCountA;
  });
  return sortWaypoints;
};

export const everythingWaypoints = shuffleWaypoints(travelDays);
export const futureWaypoints = getFutureWaypoints(travelDays);
export const nameSort = getNameSortWaypoints(travelDays);
export const timeSort = getTimeSortWaypoints(travelDays);
export const priceSort = getPriceSortWaypoints(travelDays);
export const offerSort = getOffersSortWaypoints(travelDays);

