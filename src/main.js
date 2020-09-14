import TravelDaysList from "./presenter/travel-day";
import Header from "./presenter/header";
import WaypointsModel from "./model/waypointsModel";
import Stats from "./presenter/stats";
import Api from "./api";
import OffersModel from "./model/offersModel";
import {DESTINATION_ALL, DownloadStatus, TOWNS} from "./const";
import {render} from "./util/render-function";
import SiteLoading from "./view/site-loading";

const waypointModel = new WaypointsModel();
const offersModel = new OffersModel();
const END_POINT = `https://12.ecmascript.pages.academy/big-trip/`;
const AUTHORIZATION = `Basic hS2sd3789mwl1sa2j`;
const api = new Api(END_POINT, AUTHORIZATION);
let currentStatus = DownloadStatus.OK;
render(document.querySelector(`.trip-events`), new SiteLoading());
document.querySelector(`.trip-main__event-add-btn`).setAttribute(`disabled`, `true`);

api.getDestinations().then((destination) => {
  destination.forEach((item) => {
    TOWNS.push(item.town);
    DESTINATION_ALL.push(item);
  });
}).catch(() => {
  currentStatus = DownloadStatus.FATAL_ERROR;
  throw new Error(`towns not load`);
});

api.getOffers().then((offers) => {
  offersModel.setOffers(offers);
}).catch(() => {
  currentStatus = DownloadStatus.FATAL_ERROR;
  throw new Error(`offers not load`);
});

api.getWaypoints().then((waypoints) => {
  if (currentStatus !== DownloadStatus.FATAL_ERROR) {
    waypointModel.setWaypoint(waypoints);
    const stats = new Stats(waypointModel);
    const header = new Header(waypointModel, stats, offersModel, api);
    const daysList = new TravelDaysList(waypointModel, header, offersModel, api);

    header.init();
    daysList.init();
  }
}).catch(() => {
  if (currentStatus !== DownloadStatus.FATAL_ERROR) {
    currentStatus = DownloadStatus.ERROR;
    waypointModel.setWaypoint([]);
    const stats = new Stats(waypointModel);
    const header = new Header(waypointModel, stats, offersModel);
    const daysList = new TravelDaysList(waypointModel, header, offersModel, api);

    header.init();
    daysList.init();
  }
});
