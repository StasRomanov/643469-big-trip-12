import moment from "moment";
import {DESTINATION_ALL, HOURS_IN_DAY, MAX_TOWN_IN_HEADER, MIN_IN_HOUR, TRANSFER_TYPE} from "../const";

export const getCapitalizedWord = (str) => {
  return str[0].toUpperCase() + str.slice(1);
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
    if (moment.utc(moment.duration(moment(endTime) - moment(startTime)).asMilliseconds()).format(`x`) > 0) {
      const duration = moment.duration(moment(endTime).diff(moment(startTime)));
      let day = Math.floor(duration.asDays());
      let hours = Math.floor(duration.asHours());
      let min = Math.floor(duration.asMinutes());
      day = day > 0 ? `${day}D`.padStart(3, `0`) : ``;
      hours = hours >= HOURS_IN_DAY ? `${hours % HOURS_IN_DAY}H`.padStart(3, `0`) : `${hours !== 0 ? `${hours}H`.padStart(3, `0`) : ``}`;
      min = min >= MIN_IN_HOUR ? `${min % MIN_IN_HOUR}M`.padStart(3, `0`) : `${min}M`.padStart(3, `0`);
      return `${day} ${hours} ${min}`;
    } else {
      return `00M`;
    }
  }
};

export const shuffle = (arr) => {
  let j;
  let temp;
  let array = arr.slice();
  array.forEach((item, index) => {
    j = Math.floor(Math.random() * (index + 1));
    temp = array[j];
    array[j] = item;
    array[index] = temp;
  });
  return array;
};

export const getId = () => `_${Math.random().toString(36).substr(2, 9)}`;

export const getRandomBoolean = () => Boolean(Math.round(Math.random()));

export const getOffers = (waypointType, offers) => {
  let filterOffers = offers.filter((item) => {
    return item.type.toLowerCase() === waypointType.toLowerCase();
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
  oldWaypoints.id = newWaypoint.id;
  oldWaypoints.important = newWaypoint.important;
  oldWaypoints.price = newWaypoint.price;
  oldWaypoints.type = newWaypoint.type;
  oldWaypoints.town = newWaypoint.town;
  oldWaypoints.bonusOptions = newWaypoint.bonusOptions;
  oldWaypoints.destination = newWaypoint.destination;
  oldWaypoints.startTime = newWaypoint.startTime;
  oldWaypoints.endTime = newWaypoint.endTime;
  oldWaypoints.differenceTime = getTimeDifference(newWaypoint.startTime, newWaypoint.endTime).toUpperCase();
  oldWaypoints.differenceTimeMs = getTimeDifference(newWaypoint.startTime, newWaypoint.endTime, true).toUpperCase();
};

export const updateWaypointImportantStatus = (oldWaypoints, importantStatus) => {
  oldWaypoints.important = importantStatus;
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

export const getEventTypeLabel = (type) => {
  return `${getCapitalizedWord(type)} ${TRANSFER_TYPE.includes(getCapitalizedWord(type)) ? `to` : `in`}`;
};

export const getWaypointDestination = (town) => {
  return DESTINATION_ALL.find((item) => item.town === town);
};
