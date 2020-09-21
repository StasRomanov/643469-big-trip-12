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
    this._allDataIndex = {
      WAYPOINTS: 0,
      DESTINATION: 1,
      OFFERS: 2,
    };
  }

  getAllData() {
    if (Provider.isOnline()) {
      return this._api.getAllData()
        .then((allData) => {
          const cloneData = allData[this._allDataIndex.WAYPOINTS].slice();
          const cloneDataAsServerStructure = cloneData.map(WaypointsModel.updateToServer);
          const waypoints = createStoreStructure(cloneDataAsServerStructure);
          this._waypointsStore.setItems(waypoints);

          const destinations = Object.assign(
              {},
              allData[this._allDataIndex.DESTINATION].slice().map((item) => {
                return Object.assign({}, item);
              })
          );
          this._storeDestinations.setItems(destinations);

          const offers = Object.assign({}, allData[this._allDataIndex.OFFERS]);
          this._storeOffers.setItems(offers);
          return allData;
        });
    }

    const storeWaypoints = Object.values(this._waypointsStore.getItems());
    const storeDestinations = Object.values(this._storeDestinations.getItems());
    const storeOffers = Object.values(this._storeOffers.getItems());

    return Promise.resolve([storeWaypoints, storeDestinations, storeOffers]);
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

  addWaypoint(waypoint) {
    if (Provider.isOnline()) {
      return this._api.addWaypoint(waypoint)
        .then((newWaypoint) => {
          this._waypointsStore.setItem(newWaypoint.id, WaypointsModel.updateToServer(newWaypoint));
          return newWaypoint;
        });
    }
    const localNewWaypointId = nanoid();
    const localNewWaypoint = Object.assign({}, waypoint, {id: localNewWaypointId});

    this._waypointsStore.setItem(localNewWaypoint.id, WaypointsModel.updateToServer(localNewWaypoint));

    return Promise.resolve(localNewWaypoint);
  }

  deleteWaypoint(waypoint) {
    if (Provider.isOnline()) {
      return this._api.deleteWaypoint(waypoint)
        .then(() => this._waypointsStore.removeItem(waypoint.id));
    }

    this._waypointsStore.removeItem(waypoint.id);

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
