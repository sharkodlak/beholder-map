import { Mouse as MouseControls } from './Controls/Mouse.js';


class Controls {
	static instance;

	static initialize() {
		if (!Controls.instance) {
			Controls.instance = new Controls();
		}

		return Controls.instance;
	}

	constructor() {
		this.mouseControls = new MouseControls();
	}

	initializeForMap(DOMmap) {
		this.mouseControls.initializeForMap(DOMmap);
	}
}

export { Controls };
