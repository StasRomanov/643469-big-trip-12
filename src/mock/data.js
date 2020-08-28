import {
  getId,
  getOffers,
  getRandomBoolean,
  getRandomDate,
  getRandomInteger,
  getTimeDifference,
  shuffle,
} from "../util/data-function";
import {bonusOptionMock} from "./bonusOption";

let travelDays = [];
const travel = {
  dates: [`mar 18`, `mar 19`, `mar 20`, `mar 21`],
  type: [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`,
    `Sightseeing`, `Restaurant`],
  town: [`Amsterdam`, `Chamonix`, `Geneva`],
  photo: [`http://picsum.photos/248/152?r=${Math.random()}`, `http://picsum.photos/248/152?r=${Math.random()}`,
    `http://picsum.photos/248/152?r=${Math.random()}`, `http://picsum.photos/248/152?r=${Math.random()}`],
  description: [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`, `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`, `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`, `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`, `In rutrum ac purus sit amet tempus.`],
};

const createTravelInfo = (array, mock, count = 5) => {
  mock.dates.forEach(function (item, index) {
    const travelInfo = {
      day: index,
      data: mock.dates[index].toUpperCase(),
      date: new Date(2020, 2, 18 + index),
      waypoints: [],
    };
    const dateIndexStart = [];
    const dateIndexEnd = [];
    const dateArray = getRandomDate(index, count);
    dateArray.sort(function (a, b) {
      const dateInMsA = Date.parse(a);
      const dateInMsB = Date.parse(b);
      if (dateInMsA > dateInMsB) {
        return 1;
      }
      if (dateInMsA < dateInMsB) {
        return -1;
      }
      return 0;
    });
    dateArray.forEach(function (dateItem, dateIndex) {
      if (dateIndex % 2 === 0) {
        dateIndexStart.push(dateIndex);
      } else {
        dateIndexEnd.push(dateIndex);
      }
    });
    for (let i = 0; i < count; i++) {
      const waypoint = {
        id: getId(),
        important: getRandomBoolean(),
        price: Math.round(Math.random() * 300),
        type: mock.type[getRandomInteger(0, mock.type.length - 1)],
        town: mock.town[getRandomInteger(0, mock.town.length - 1)],
        startTime: dateArray[dateIndexStart[i]],
        endTime: dateArray[dateIndexEnd[i]],
        photos: shuffle(mock.photo).slice(0, getRandomInteger(1, mock.photo.length)),
        description: shuffle(mock.description).slice(0, 5),
      };
      waypoint.bonusOptions = getOffers(waypoint, bonusOptionMock);
      waypoint.differenceTime = getTimeDifference(waypoint.startTime, waypoint.endTime).toUpperCase();
      waypoint.differenceTimeMs = getTimeDifference(waypoint.startTime, waypoint.endTime, true);
      travelInfo.waypoints.push(waypoint);
    }
    array.push(travelInfo);
  });
  return array;
};

travelDays = createTravelInfo(travelDays, travel);
export {travelDays};
