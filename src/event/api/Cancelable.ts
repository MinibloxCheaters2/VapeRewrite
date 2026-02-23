/**
 * CancelableWrapper but there's no data
 */
export default class Cancelable {
	#canceled: boolean = false;

	cancel() {
		this.#canceled = true;
	}

	get canceled(): boolean {
		return this.#canceled;
	}
}
