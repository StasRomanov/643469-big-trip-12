import {nanoid} from "nanoid";
import WaypointsModel from "../model/waypointsModel";

const getSyncedTasks = (items) => {
  return items.filter(({success}) => success).map(({payload}) => {
    return payload.point;
  });
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, waypointsStore, destinationStore, offersStore) {
    this._api = api;
    this._waypointsStore = waypointsStore;
    this._storeDestinations = destinationStore;
    this._storeOffers = offersStore;
  }

  getAllData() {
    if (Provider.isOnline()) {
      return this._api.getAllData()
        .then((allData) => {
          const waypoints = createStoreStructure(allData[0]);
          this._waypointsStore.setItems(waypoints);

          const destinations = Object.assign(
              {},
              allData[1].slice().map((item) => {
                return Object.assign({}, item);
              })
          );
          this._storeDestinations.setItems(destinations);

          const offers = Object.assign({}, allData[2]);
          this._storeOffers.setItems(offers);
          return allData;
        });
    }

    const storeEvents = Object.values(this._waypointsStore.getItems());
    const storeDestinations = Object.values(this._storeDestinations.getItems());
    const storeOffers = Object.values(this._storeOffers.getItems());

    return Promise.resolve([storeEvents, storeDestinations, storeOffers]);
  }

  updateWaypoint(waypoint) {
    if (Provider.isOnline()) {
      return this._api.updateWaypoint(waypoint)
        .then((updatedTask) => {
          this._waypointsStore.setItem(updatedTask.id, WaypointsModel.updateToServer(updatedTask));
          return updatedTask;
        });
    }

    this._waypointsStore.setItem(waypoint.id, WaypointsModel.updateToServer(Object.assign({}, waypoint)));

    return Promise.resolve(waypoint);
  }

  addWaypoint(task) {
    if (Provider.isOnline()) {
      return this._api.addWaypoint(task)
        .then((newTask) => {
          this._waypointsStore.setItem(newTask.id, WaypointsModel.updateToServer(newTask));
          return newTask;
        });
    }
    const localNewTaskId = nanoid();
    const localNewTask = Object.assign({}, task, {id: localNewTaskId});

    this._waypointsStore.setItem(localNewTask.id, WaypointsModel.updateToServer(localNewTask));

    return Promise.resolve(localNewTask);
  }

  deleteWaypoint(task) {
    if (Provider.isOnline()) {
      return this._api.deleteWaypoint(task)
        .then(() => this._waypointsStore.removeItem(task.id));
    }

    this._waypointsStore.removeItem(task.id);

    return Promise.resolve();
  }

  sync() {
    if (Provider.isOnline()) {
      const storeWaypoints = Object.values(this._waypointsStore.getItems());

      return this._api.sync(storeWaypoints)
        .then((response) => {
          const createdWaypoints = getSyncedTasks(response.created);
          const updatedWaypoints = getSyncedTasks(response.updated);
          const items = createStoreStructure([...createdWaypoints, ...updatedWaypoints]);

          this._waypointsStore.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}
