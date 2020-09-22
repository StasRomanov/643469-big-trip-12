import Observer from "../util/observer";

export default class DestinationModel extends Observer {
  constructor() {
    super();
  }

  static updateToClient(destination) {
    const adaptedDestination = Object.assign({},
        destination,
        {
          town: destination.name,
          photos: destination.pictures,
        }
    );
    delete adaptedDestination.pictures;
    delete adaptedDestination.name;
    return adaptedDestination;
  }
}
