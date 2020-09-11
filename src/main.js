import TravelDaysList from "./presenter/travel-day";
import Header from "./presenter/header";
import WaypointsModel from "./model/waypointsModel";
import Stats from "./presenter/stats";
import Api from "./api";
import OffersModel from "./model/offersModel";
import {DESTINATION_ALL, TOWNS} from "./const";

const waypointModel = new WaypointsModel();
const offersModel = new OffersModel();
const END_POINT = `https://12.ecmascript.pages.academy/big-trip/`;
const AUTHORIZATION = `Basic hS2sd3789mwl1sa2j`;
const api = new Api(END_POINT, AUTHORIZATION);

api.getDestinations().then((destination) => {
  destination.forEach((item) => {
    TOWNS.push(item.town);
    DESTINATION_ALL.push(item);
  });
});

api.getOffers().then((offers) => {
  offersModel.setOffers(offers);
  api.getWaypoints().then((waypoints) => {
    waypointModel.setWaypoint(waypoints);
    const stats = new Stats(waypointModel);
    const header = new Header(waypointModel, stats, offersModel);
    const daysList = new TravelDaysList(waypointModel, header, offersModel);

    header.init();
    daysList.init();
  });
});


