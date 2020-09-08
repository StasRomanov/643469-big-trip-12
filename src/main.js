import {waypoints} from "./mock/data";
import TravelDaysList from "./presenter/travel-day";
import Header from "./presenter/header";
import Waypoints from "./model/waypoints";
import Stats from "./presenter/stats";

const waypointModel = new Waypoints();
waypointModel.setWaypoint(waypoints);
const stats = new Stats(waypointModel);
const header = new Header(waypointModel, stats);
const daysList = new TravelDaysList(waypointModel, header);

header.init();
daysList.init();
