import WaypointsModel from "../model/waypointsModel";
import OffersModel from "../model/offersModel";
import DestinationModel from "../model/destinationModel";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`,
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export const DataStatus = {
  WAYPOINTS: true,
  OFFERS: true,
  DESTINATION: true,
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getWaypoints() {
    return this._load({url: `points`})
      .then(Api.toJSON)
      .then((waypoints) => waypoints.map(WaypointsModel.updateToClient)).catch(() => {
        DataStatus.WAYPOINTS = false;
        return [];
      });
  }

  getOffers() {
    return this._load({url: `offers`}).then(Api.toJSON)
      .then((offers) => offers.map(OffersModel.updateToClient)).catch(() => {
        DataStatus.OFFERS = false;
        return [];
      });
  }

  getDestinations() {
    return this._load({url: `destinations`}).then(Api.toJSON)
      .then((destinations) => destinations.map(DestinationModel.updateToClient)).catch(() => {
        DataStatus.DESTINATION = false;
        return [];
      });
  }

  getAllData() {
    return Promise.all([this.getWaypoints(), this.getDestinations(), this.getOffers()]);
  }

  updateWaypoint(waypoint) {
    return this._load({
      url: `points/${waypoint.id}`,
      method: Method.PUT,
      body: JSON.stringify(WaypointsModel.updateToServer(waypoint)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(WaypointsModel.updateToClient);
  }

  addWaypoint(waypoint) {
    return this._load({
      url: `points`,
      method: Method.POST,
      body: JSON.stringify(WaypointsModel.updateToServer(waypoint)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(WaypointsModel.updateToClient);
  }

  deleteWaypoint(waypoint) {
    return this._load({
      url: `points/${waypoint.id}`,
      method: Method.DELETE
    });
  }

  sync(data) {
    return this._load({
      url: `points/sync`,
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN &&
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
