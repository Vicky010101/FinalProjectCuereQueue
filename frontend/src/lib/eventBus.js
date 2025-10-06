class QueueEventBus {
	constructor() {
		this.eventTarget = new EventTarget();
	}

	publishQueueUpdate(update) {
		const event = new CustomEvent("queue:update", { detail: update });
		this.eventTarget.dispatchEvent(event);
	}

	subscribeQueueUpdates(callback) {
		const handler = (e) => callback(e.detail);
		this.eventTarget.addEventListener("queue:update", handler);
		return () => this.eventTarget.removeEventListener("queue:update", handler);
	}

	publishWaitingTimeUpdate(update) {
		const event = new CustomEvent("waiting-time:update", { detail: update });
		this.eventTarget.dispatchEvent(event);
	}

	subscribeWaitingTimeUpdates(callback) {
		const handler = (e) => callback(e.detail);
		this.eventTarget.addEventListener("waiting-time:update", handler);
		return () => this.eventTarget.removeEventListener("waiting-time:update", handler);
	}

	publishHomeVisitUpdate(update) {
		const event = new CustomEvent("home-visit:update", { detail: update });
		this.eventTarget.dispatchEvent(event);
	}

	subscribeHomeVisitUpdates(callback) {
		const handler = (e) => callback(e.detail);
		this.eventTarget.addEventListener("home-visit:update", handler);
		return () => this.eventTarget.removeEventListener("home-visit:update", handler);
	}

	emit(eventName, data) {
		const event = new CustomEvent(eventName, { detail: data });
		this.eventTarget.dispatchEvent(event);
	}

	subscribe(eventName, callback) {
		const handler = (e) => callback(e.detail);
		this.eventTarget.addEventListener(eventName, handler);
		return () => this.eventTarget.removeEventListener(eventName, handler);
	}
}

export const queueBus = new QueueEventBus();



