import {waypoints} from "./mock/data";
import TravelDaysList from "./presenter/travel-day";
import Header from "./presenter/header";
import Waypoints from "./model/waypoints";

const waypointModel = new Waypoints();
waypointModel.setWaypoint(waypoints);
const header = new Header();
const daysList = new TravelDaysList(waypointModel);

header.init();
daysList.init();
