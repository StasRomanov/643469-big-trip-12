let days = [];

const getRandomInteger = (min, max) => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const getRandomTime = () => {
  let hours = getRandomInteger(0, 23);
  let min = getRandomInteger(0, 59);
  if (String(min).length === 1) {
    min = `0` + min;
  }
  if (String(hours).length === 1) {
    hours = `0` + hours;
  }
  return `${hours}:${min}`;
};

const getTimeDifference = (startTime, endTime) => {
  const dayHours = 24;
  const hourMinutes = 60;
  const startHours = Number(startTime.split(`:`)[0]);
  const startMin = Number(startTime.split(`:`)[1]);
  const endHours = Number(endTime.split(`:`)[0]);
  const endMin = Number(endTime.split(`:`)[1]);
  let differenceDay = 0;
  let differenceHours;
  let differenceMin;
  if (endHours > startHours) {
    differenceHours = endHours - startHours;
  } else {
    differenceHours = (dayHours - startHours) + endHours;
  }
  if (endMin > startMin) {
    differenceMin = endMin - startMin;
  } else {
    differenceMin = (hourMinutes - startMin) + endMin;
    differenceHours -= 1;
  }
  if (differenceMin > hourMinutes) {
    differenceMin -= hourMinutes;
    differenceHours += 1;
  }
  if (differenceHours >= dayHours) {
    differenceDay = 1;
    differenceHours -= dayHours;
  }
  return `${differenceDay === 0 ? `` : differenceDay + `d`} ${String(differenceHours)}h ${String(differenceMin)}m`;
};

const shuffle = (arr) => {
  let j;
  let temp;
  let array = arr.slice();
  for (let i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
};

const getRandomBoolean = () => Boolean(Math.round(Math.random()));

const travel = {
  dates: [`mar 18`, `mar 21`, `mar 27`, `mar 30`],
  type: [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`,
    `Sightseeing`, `Restaurant`],
  town: [`Amsterdam`, `Chamonix`, `Geneva`],
  startTime: [getRandomTime(), getRandomTime(), getRandomTime(), getRandomTime()],
  endTime: [getRandomTime(), getRandomTime(), getRandomTime(), getRandomTime()],
  photo: [`http://picsum.photos/248/152?r=${Math.random()}`, `http://picsum.photos/248/152?r=${Math.random()}`,
    `http://picsum.photos/248/152?r=${Math.random()}`, `http://picsum.photos/248/152?r=${Math.random()}`],
  description: [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`, `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`, `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`, `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`, `In rutrum ac purus sit amet tempus.`],
  bonusOption: [
    {
      name: `Add luggage`,
      price: 30,
      // used: getRandomBoolean(),
    },
    {
      name: `Switch to comfort class`,
      price: 100,
      // used: getRandomBoolean(),
    },
    {
      name: `Add meal`,
      price: 15,
      // used: getRandomBoolean(),
    },
    {
      name: `Choose seats`,
      price: 5,
      // used: getRandomBoolean(),
    },
    {
      name: `Travel by train`,
      price: 40,
      // used: getRandomBoolean(),
    },
  ]
};

const createTravelInfo = (array, mock, count = 4) => {
  for (let j = 0; j < mock.dates.length; j++) {
    let travelInfo = {
      day: j,
      data: mock.dates[j].toUpperCase(),
      waypoints: [],
    };
    for (let i = 0; i < count; i++) {
      let waypoint = {
        type: mock.type[getRandomInteger(0, mock.type.length - 1)],
        town: mock.town[getRandomInteger(0, mock.town.length - 1)],
        startTime: mock.startTime[getRandomInteger(0, mock.startTime.length - 1)],
        endTime: mock.endTime[getRandomInteger(0, mock.endTime.length - 1)],
        photo: shuffle(mock.photo).slice(0, getRandomInteger(1, mock.photo.length)),
        description: shuffle(mock.description).slice(0, 5),
        bonusOption: shuffle(mock.bonusOption),
      };
      for (let option of waypoint.bonusOption) {
        option.used = getRandomBoolean();
      }
      waypoint.differenceTime = getTimeDifference(waypoint.startTime, waypoint.endTime).toUpperCase();
      travelInfo.waypoints.push(waypoint);
    }
    array.push(travelInfo);
  }
  return array;
};

days = createTravelInfo(days, travel);
export {days};
