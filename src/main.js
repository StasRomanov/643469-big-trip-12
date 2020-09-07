import {waypoints} from "./mock/data";
import TravelDaysList from "./presenter/travel-day";
import Header from "./presenter/header";
import Waypoints from "./model/waypoints";
import Stats from "./presenter/stats";

const waypointModel = new Waypoints();
waypointModel.setWaypoint(waypoints);
const header = new Header(waypointModel);
const daysList = new TravelDaysList(waypointModel, header);
const stats = new Stats(waypointModel, daysList);

header.init();
daysList.init();
stats.init();
