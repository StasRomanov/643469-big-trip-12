let waypoints = [];

const getRandomInteger = (min, max) => {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const getRandomTime = () => {
  let hours = getRandomInteger(0, 24);
  let min = getRandomInteger(0, 59);
  if (String(min).length === 1) {
    min = `0` + min;
  }
  if (String(hours).length === 1) {
    hours = `0` + hours;
  }
  return `${hours}:${min}`;
};

const shuffle = (arr) => {
  let j;
  let temp;
  for (let i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[j];
    arr[j] = arr[i];
    arr[i] = temp;
  }
  return arr;
};

const getRandomBoolean = () => Boolean(Math.round(Math.random()));

const travel = {
  type: [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`, `Check-in`,
    `Sightseeing`, `Restaurant`],
  town: [`Amsterdam`, `Chamonix`, `Geneva`],
  startTime: [getRandomTime(), getRandomTime(), getRandomTime(), getRandomTime()],
  endTime: [getRandomTime(), getRandomTime(), getRandomTime(), getRandomTime()],
  location: {
    photo: [`http://picsum.photos/248/152?r=${Math.random()}`, `http://picsum.photos/248/152?r=${Math.random()}`,
      `http://picsum.photos/248/152?r=${Math.random()}`, `http://picsum.photos/248/152?r=${Math.random()}`],
    description: [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
      `Cras aliquet varius magna, non porta ligula feugiat eget.`, `Fusce tristique felis at fermentum pharetra.`,
      `Aliquam id orci ut lectus varius viverra.`, `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
      `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
      `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
      `Sed sed nisi sed augue convallis suscipit in sed felis.`, `Aliquam erat volutpat.`,
      `Nunc fermentum tortor ac porta dapibus.`, `In rutrum ac purus sit amet tempus.`],
  },
  bonusOption: [
    {
      name: `Add luggage`,
      price: 30,
      used: getRandomBoolean(),
    },
    {
      name: `Switch to comfort class`,
      price: 100,
      used: getRandomBoolean(),
    },
    {
      name: `Add meal`,
      price: 15,
      used: getRandomBoolean(),
    },
    {
      name: `Choose seats`,
      price: 5,
      used: getRandomBoolean(),
    },
    {
      name: `Travel by train`,
      price: 40,
      used: getRandomBoolean(),
    },
  ]
};

const createTravelInfo = (array, mock, count = 8) => {
  for (let i = 0; i < count; i++) {
    let waypoint = {
      type: mock.type[getRandomInteger(0, mock.type.length - 1)],
      town: mock.town[getRandomInteger(0, mock.town.length - 1)],
      startTime: mock.startTime[getRandomInteger(0, mock.startTime.length - 1)],
      endTime: mock.endTime[getRandomInteger(0, mock.endTime.length - 1)],
      location: {
        photo: shuffle(mock.location.photo).slice(0, getRandomInteger(1, mock.location.photo.length)),
        description: shuffle(mock.location.description).slice(0, 5),
      },
      bonusOption: mock.bonusOption
    };
    array.push(waypoint);
  }
  return array;
};

waypoints = createTravelInfo(waypoints, travel);
export {waypoints};
