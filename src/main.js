import {waypoints} from "./mock/data";
import TravelDaysList from "./presenter/travel-day";
import Header from "./presenter/header";
import Waypoints from "./model/waypoints";
import Filter from "./model/filter";
import {FilterType} from "./const";

const waypointModel = new Waypoints();
const WaypointFilter = new Filter();
waypointModel.setWaypoint(waypoints);
WaypointFilter.setFilter(FilterType.DEFAULT);
const header = new Header(waypointModel);
const daysList = new TravelDaysList(waypointModel, header);

header.init();
daysList.init();
