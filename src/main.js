import {waypoints} from "./mock/data";
import TravelDaysList from "./presenter/travel-day";
import Header from "./presenter/header";
import WaypointsModel from "./model/waypointsModel";
import Stats from "./presenter/stats";

const waypointModel = new WaypointsModel();
waypointModel.setWaypoint(waypoints);
const stats = new Stats(waypointModel);
const header = new Header(waypointModel, stats);
const daysList = new TravelDaysList(waypointModel, header);

header.init();
daysList.init();
