import WaypointsModel from "./model/waypointsModel";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getTasks() {
    return this._load({url: `tasks`})
      .then(Api.toJSON)
      .then((tasks) => tasks.map(WaypointsModel.adaptToClient));
  }

  updateTask(task) {
    return this._load({
      url: `tasks/${task.id}`,
      method: Method.PUT,
      body: JSON.stringify(WaypointsModel.adaptToServer(task)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(WaypointsModel.adaptToClient);
  }

  addTask(task) {
    return this._load({
      url: `tasks`,
      method: Method.POST,
      body: JSON.stringify(WaypointsModel.adaptToServer(task)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(WaypointsModel.adaptToClient);
  }

  deleteTask(task) {
    return this._load({
      url: `tasks/${task.id}`,
      method: Method.DELETE
    });
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
