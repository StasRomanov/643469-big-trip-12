import {waypoints} from "./mock/data";
import TravelDaysList from "./presenter/travel-day";
import {Header} from "./presenter/header";

const daysList = new TravelDaysList();
const header = new Header();

// renderFilter();
header.init();
daysList.init(waypoints);
