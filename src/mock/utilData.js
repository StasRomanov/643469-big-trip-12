let travelDays = [];

const getRandomInteger = (min, max) => Math.floor(min + Math.random() * (max + 1 - min));

const getRandomDate = (day, count = 10) => {
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

const msToTime = (timeInMs) => {
  let minutes = parseInt((timeInMs / (1000 * 60)) % 60, 10);
  let hours = parseInt((timeInMs / (1000 * 60 * 60)) % 24, 10);
  hours = (hours < 10) ? `0` + hours : hours;
  minutes = (minutes < 10) ? `0` + minutes : minutes;
  return `${hours > 0 ? hours + `h` : ``} ${minutes > 0 ? minutes + `m` : ``}`;
};

const getTimeDifference = (startTime, endTime) => {
  const dateInMsA = Date.parse(startTime);
  const dateInMsB = Date.parse(endTime);
  const timeDifference = dateInMsB - dateInMsA;
  return msToTime(timeDifference);
};

const shuffle = (arr) => {
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
        important: getRandomBoolean(),
        price: Math.round(Math.random() * 300),
        type: mock.type[getRandomInteger(0, mock.type.length - 1)],
        town: mock.town[getRandomInteger(0, mock.town.length - 1)],
        startTime: dateArray[dateIndexStart[i]],
        endTime: dateArray[dateIndexEnd[i]],
        photos: shuffle(mock.photo).slice(0, getRandomInteger(1, mock.photo.length)),
        description: shuffle(mock.description).slice(0, 5),
        bonusOptions: shuffle(mock.bonusOption).map((item) => {
          return {name: item.name, price: item.price, used: getRandomBoolean()};
        })
      };
      waypoint.differenceTime = getTimeDifference(waypoint.startTime, waypoint.endTime).toUpperCase();
      travelInfo.waypoints.push(waypoint);
    }
    array.push(travelInfo);
  });
  return array;
};

travelDays = createTravelInfo(travelDays, travel);
export {travelDays};
