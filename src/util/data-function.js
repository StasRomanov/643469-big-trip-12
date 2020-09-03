import moment from "moment";
import {MAX_TOWN_IN_HEADER} from "../const";

const getCapitalizedWord = (str) => {
  if (typeof str === `string`) {
    return str[0].toUpperCase() + str.slice(1);
  }
  return str;
};

export const getRandomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

export const getRandomDate = (day, count = 10) => {
  const dateArr = [];
  for (let i = 0; i < count * 2; i++) {
    const currentDate = new Date();
    currentDate.setMonth(3);
    currentDate.setDate(18 + day);
    currentDate.setHours(getRandomInteger(0, 23));
    currentDate.setMinutes(getRandomInteger(0, 60));
    dateArr.push(currentDate);
  }
  return dateArr;
};

export const getTimeDifference = (startTime, endTime, msMode = false) => {
  if (msMode) {
    return moment.utc(moment.duration(moment(endTime) - moment(startTime)).asMilliseconds()).format(`x`);
  } else {
    const days = moment(endTime).format(`D`) - moment(startTime).format(`D`) > 0 ?
      `${moment(endTime).format(`D`) - moment(startTime).format(`D`)}D` : ``;
    const timeDifference = moment.utc(moment.duration(moment(endTime) - moment(startTime)).asMilliseconds()).format(`HH mm[M]`);
    const hours = Number(timeDifference.split(` `)[0]) > 0 ? timeDifference.split(` `)[0] + `H` : ``;
    const min = timeDifference.split(` `)[1];
    return `${days} ${hours} ${min}`;
  }
};

export const shuffle = (arr) => {
  let j;
  let temp;
  let array = arr.slice();
  array.forEach(function (item, index) {
    j = Math.floor(Math.random() * (index + 1));
    temp = array[j];
    array[j] = item;
    array[index] = temp;
  });
  return array;
};

export const getId = () => `_${Math.random().toString(36).substr(2, 9)}`;

export const getRandomBoolean = () => Boolean(Math.round(Math.random()));

export const getOffers = (waypoint, offers) => {
  let filterOffers = offers.filter((item) => {
    return item.type.toLowerCase() === waypoint.type.toLowerCase();
  });
  filterOffers = filterOffers[0].offers;
  filterOffers.forEach((item) => {
    item.name = getCapitalizedWord(item.name);
    item.used = getRandomBoolean();
    item.price = getRandomInteger(30, 400);
  });
  return filterOffers;
};

export const updateWaypoints = (oldWaypoints, newWaypoint) => {
  oldWaypoints.important = newWaypoint.importantMode;
  oldWaypoints.price = newWaypoint.price;
  oldWaypoints.type = newWaypoint.type;
  oldWaypoints.town = newWaypoint.town;
  oldWaypoints.bonusOptions = newWaypoint.bonusOptions;
  oldWaypoints.description = newWaypoint.offersDescription;
  oldWaypoints.startTime = newWaypoint.startTime;
  oldWaypoints.endTime = newWaypoint.endTime;
  oldWaypoints.differenceTime = getTimeDifference(newWaypoint.startTime, newWaypoint.endTime).toUpperCase();
  oldWaypoints.differenceTimeMs = getTimeDifference(newWaypoint.startTime, newWaypoint.endTime, true).toUpperCase();
};

export const getSimilarWaypointInfo = (waypoints) => {
  let townsList = [];
  let townChangeCount = 0;
  let currentTown = null;
  waypoints.forEach((item) => {
    if (currentTown !== item.town) {
      currentTown = item.town;
      townChangeCount++;
      townsList.push(item.town);
    }
  });
  return {
    status: townChangeCount <= MAX_TOWN_IN_HEADER,
    items: townsList,
  };
};

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};

export const removeItem = (items, update) => {
  return items.filter((item) => item.id !== update.id);
};
