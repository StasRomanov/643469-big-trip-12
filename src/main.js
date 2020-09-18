import TravelDaysList from "./presenter/travel-day";
import Header from "./presenter/header";
import WaypointsModel from "./model/waypointsModel";
import Stats from "./presenter/stats";
import Api from "./api/index";
import OffersModel from "./model/offersModel";
import {DESTINATION_ALL, DownloadStatus, TOWNS} from "./const";
import {render} from "./util/render-function";
import SiteLoading from "./view/site-loading";
import Provider from "./api/provider";
import Store from "./api/store";
import {DataStatus} from "./api";

const waypointModel = new WaypointsModel();
const offersModel = new OffersModel();
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;
const AUTHORIZATION = `Basic hS02sd38hg9m0wl1sa2j`;
const STORE_PREFIX = `big_trip_web-localstorage`;
const DataType = {
  WAYPOINTS: `waypoints`,
  OFFERS: `offers`,
  DESTINATION: `destination`,
};
const STORE_VER = `v12`;
const WAYPOINTS_STORE_NAME = `${STORE_PREFIX}_(${DataType.WAYPOINTS})-${STORE_VER}`;
const DESTINATION_STORE_NAME = `${STORE_PREFIX}_(${DataType.DESTINATION})-${STORE_VER}`;
const OFFERS_STORE_NAME = `${STORE_PREFIX}_(${DataType.OFFERS})-${STORE_VER}`;
const api = new Api(END_POINT, AUTHORIZATION);
const waypointStore = new Store(WAYPOINTS_STORE_NAME, window.localStorage);
const offersStore = new Store(DESTINATION_STORE_NAME, window.localStorage);
const destinationStore = new Store(OFFERS_STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, waypointStore, offersStore, destinationStore);
let currentStatus = DownloadStatus.OK;
render(document.querySelector(`.trip-events`), new SiteLoading());
document.querySelector(`.trip-main__event-add-btn`).setAttribute(`disabled`, `true`);

apiWithProvider.getAllData()
  .then((data) => {
    return {
      waypoints: data[0],
      destination: data[1],
      offers: data[2],
    };
  })
  .then((data) => {
    data.destination.forEach((item) => {
      TOWNS.push(item.town);
      DESTINATION_ALL.push(item);
    });
    return data;
  })
  .then((data) => {
    offersModel.setOffers(data.offers);
    return data;
  })
  .then((data) => {
    if (DataStatus.OFFERS && DataStatus.DESTINATION) {
      waypointModel.setWaypoint(data.waypoints);
      const stats = new Stats(waypointModel);
      const header = new Header(waypointModel, stats, offersModel, apiWithProvider);
      const daysList = new TravelDaysList(waypointModel, header, offersModel, apiWithProvider);

      header.init();
      daysList.init();
      DataStatus.WAYPOINTS = true;
    }
  }).catch((e) => {
    if (!(DataStatus.OFFERS && DataStatus.DESTINATION)) {
      currentStatus = DownloadStatus.FATAL_ERROR;
      throw new Error(`Main data not load.
      offers status = ${DataStatus.OFFERS ? `Ok` : `not load`}.
      destination status = ${DataStatus.DESTINATION ? `Ok` : `not load`}
      site status = ${currentStatus}
      error: ${e}`);
    }
    currentStatus = DownloadStatus.ERROR;
    waypointModel.setWaypoint([]);
    const stats = new Stats(waypointModel);
    const header = new Header(waypointModel, stats, offersModel);
    const daysList = new TravelDaysList(waypointModel, header, offersModel, apiWithProvider);

    header.init();
    daysList.init();
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`)
    .then(() => {
      // eslint-disable-next-line no-console
      console.log(`ServiceWorker available`);
    }).catch(() => {
    // eslint-disable-next-line no-console
      console.error(`ServiceWorker isn't available`);
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
