let days = [];

const getRandomInteger = (min, max) => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const getRandomTime = (minMinute = 0, maxMinute = 60, minHours = 0, maxHours = 23) => {
  let hours = getRandomInteger(minHours, maxHours);
  let min = getRandomInteger(minMinute, maxMinute);
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
  }
  if (endHours === startHours) {
    differenceHours = 0;
  }
  if (endHours < startHours) {
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
  bonusOption: [
    {
      name: `Add luggage`,
      price: 30,
    },
    {
      name: `Switch to comfort class`,
      price: 100,
    },
    {
      name: `Add meal`,
      price: 15,
    },
    {
      name: `Choose seats`,
      price: 5,
    },
    {
      name: `Travel by train`,
      price: 40,
    },
  ]
};

const createTravelInfo = (array, mock, count = 5) => {
  for (let j = 0; j < mock.dates.length; j++) {
    let travelInfo = {
      day: j,
      data: mock.dates[j].toUpperCase(),
      waypoints: [],
    };
    for (let i = 0; i < count; i++) {
      let waypoint = {
        price: Math.round(Math.random() * 300),
        type: mock.type[getRandomInteger(0, mock.type.length - 1)],
        town: mock.town[getRandomInteger(0, mock.town.length - 1)],
        startTime: getRandomTime(),
        photos: shuffle(mock.photo).slice(0, getRandomInteger(1, mock.photo.length)),
        description: shuffle(mock.description).slice(0, 5),
        bonusOptions: shuffle(mock.bonusOption).map((o) => {
          return {name: o.name, price: o.price, used: getRandomBoolean()};
        })
      };
      travelInfo.waypoints.push(waypoint);
    }
    travelInfo.waypoints.sort(function (a, b) {
      let hoursA = Number(a.startTime.split(`:`)[0]);
      let hoursB = Number(b.startTime.split(`:`)[0]);
      let minA = Number(a.startTime.split(`:`)[1]);
      let minB = Number(b.startTime.split(`:`)[1]);
      if (hoursA > hoursB) {
        return 1;
      }
      if (hoursA < hoursB) {
        return -1;
      }
      if (hoursA === hoursB) {
        if (minA > minB) {
          return 1;
        }
        if (minA < minB) {
          return -1;
        }
      }
      return 0;
    });
    for (let i = 0; i <= travelInfo.waypoints.length; i++) {
      if (i > 0 || i === travelInfo.waypoints.length) {
        if (i > 0 && i !== travelInfo.waypoints.length) {
          let endMin = 0;
          let endHours = 0;
          let startTimeA = travelInfo.waypoints[i - 1].startTime;
          let startTimeB = travelInfo.waypoints[i].startTime;
          let endMinA = Number(startTimeA.split(`:`)[1]);
          let endMinB = Number(startTimeB.split(`:`)[1]);
          let endHoursA = Number(startTimeA.split(`:`)[0]);
          let endHoursB = Number(startTimeB.split(`:`)[0]);
          if (endHoursA === endHoursB && endMinA === endMinB) {
            endHours = endHoursA;
            endMin = endMinA;
          } else if (endHoursA === endHoursB) {
            endHours = endHoursA;
            endMin = getRandomInteger(endMinA + 1, endMinB);
          } else {
            endHours = getRandomInteger(endHoursA + 1, endHoursB);
            if (endHoursA + 1 === endHoursB) {
              endMin = getRandomInteger(0, endMinB - 1);
            } else {
              endMin = getRandomInteger(0, endMinB - 1);
            }
          }
          if (String(endMin).length === 1) {
            endMin = `0` + endMin;
          }
          if (String(endHours).length === 1) {
            endHours = `0` + endHours;
          }
          travelInfo.waypoints[i - 1].endTime = `${endHours}:${endMin}`;
          travelInfo.waypoints[i - 1].differenceTime = getTimeDifference(travelInfo.waypoints[i - 1].startTime, travelInfo.waypoints[i - 1].endTime).toUpperCase();
        } else {
          travelInfo.waypoints[i - 1].endTime = getRandomTime(Number(travelInfo.waypoints[i - 1].startTime.split(`:`)[1]),
              59, Number(travelInfo.waypoints[i - 1].startTime.split(`:`)[0]), 23);
          travelInfo.waypoints[i - 1].differenceTime = getTimeDifference(travelInfo.waypoints[i - 1].startTime,
              travelInfo.waypoints[i - 1].endTime).toUpperCase();
        }
      }
    }
    array.push(travelInfo);
  }
  return array;
};

days = createTravelInfo(days, travel);
export {days};
