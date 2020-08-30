export default class Observer {
  constructor() {
    this._observers = [];
  }

  addObserver(observer) {
    this._observers.push(observer);
  }

  removeObserver(observer) {
    this._observers = this._observers.filter((observer) !== observer);
  }

  destroyObserver() {
    this._observers = [];
  }

  notify() {
    this._observers.forEach((observer) => observer());
  }
}
