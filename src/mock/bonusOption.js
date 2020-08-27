import {getRandomBoolean} from "../util/data-function";

export const bonusOptionMock = [
  {
    type: `taxi`,
    names: [`switch to comfort class`, `with kids`, `good driver`, `expensive car`],
    prices: [30, 10, 15, 40],
    used: [getRandomBoolean(), getRandomBoolean(), getRandomBoolean(), getRandomBoolean()],
  },
  {
    type: `bus`,
    names: [`fast route`, `guide`, `good driver`, `free seats`],
    prices: [30, 25, 15, 10],
    used: [getRandomBoolean(), getRandomBoolean(), getRandomBoolean(), getRandomBoolean()],
  },
  {
    type: `train`,
    names: [`fast route`, `guide`, `good driver`, `heavy luggage`],
    prices: [30, 25, 15, 10],
    used: [getRandomBoolean(), getRandomBoolean(), getRandomBoolean(), getRandomBoolean()],
  },
  {
    type: `ship`,
    names: [`fast route`, `guide`, `good captain`, `beautiful view`],
    prices: [30, 25, 15, 10],
    used: [getRandomBoolean(), getRandomBoolean(), getRandomBoolean(), getRandomBoolean()],
  },
  {
    type: `transport`,
    names: [`fast route`, `guide`, `good driver`, `beautiful view`],
    prices: [30, 25, 15, 10],
    used: [getRandomBoolean(), getRandomBoolean(), getRandomBoolean(), getRandomBoolean()],
  },
  {
    type: `drive`,
    names: [`fast route`, `guide`, `good driver`, `beautiful view`],
    prices: [30, 25, 15, 10],
    used: [getRandomBoolean(), getRandomBoolean(), getRandomBoolean(), getRandomBoolean()],
  },
  {
    type: `flight`,
    names: [`fast wi-fi`, `wi-fi`, `good driver`, `beautiful view`],
    prices: [30, 25, 15, 10],
    used: [getRandomBoolean(), getRandomBoolean(), getRandomBoolean(), getRandomBoolean()],
  },
  {
    type: `check-in`,
    names: [`fast check`, `wi-fi`, `beautiful hotel`],
    prices: [30, 25, 75],
    used: [getRandomBoolean(), getRandomBoolean(), getRandomBoolean()],
  },
  {
    type: `sightseeing`,
    names: [`long route`, `guide`, `awesome guide`, `beautiful view`],
    prices: [30, 25, 15, 10],
    used: [getRandomBoolean(), getRandomBoolean(), getRandomBoolean(), getRandomBoolean()],
  },
  {
    type: `restaurant`,
    names: [`Add meal`, `exclusive dishes`, `awesome menu`, `beautiful view`],
    prices: [30, 25, 15, 10],
    used: [getRandomBoolean(), getRandomBoolean(), getRandomBoolean(), getRandomBoolean()],
  },
];
