import moment from "moment";

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
    const timeDifference = moment.utc(moment.duration(moment(endTime) - moment(startTime)).asMilliseconds()).format(`HH mm`);
    const hours = Number(timeDifference.split(` `)[0]) > 0 ? timeDifference.split(` `)[0] + `H` : ``;
    const min = Number(timeDifference.split(` `)[1]) > 0 ? timeDifference.split(` `)[1] + `M` : ``;
    return `${hours} ${min}`;
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

export const ucFirst = (str) => {
  if (!str) {
    return str;
  }
  return str[0].toUpperCase() + str.slice(1);
};

export const getOffers = (mock, offers) => {
  let bonusOptions = [];
  let filterOffers = offers.filter((item) => {
    return item.type.toLowerCase() === mock.type.toLowerCase();
  });
  filterOffers = filterOffers[0];
  filterOffers.names.forEach((item, index) => {
    bonusOptions.push({
      name: ucFirst(filterOffers.names[index]),
      price: filterOffers.prices[index],
      used: filterOffers.used[index],
    });
  });
  return bonusOptions;
};
