export default class CancelableWrapper<T> {
  #canceled: boolean = false;
  constructor(public data: T) {}
  cancel() {
    this.#canceled = true;
  }
  get canceled(): boolean {
    return this.#canceled;
  }
}
