import { Keyboard as KeyboardControls } from './Controls/Keyboard.js';
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
		this.keyboardControls = new KeyboardControls();
		this.mouseControls = new MouseControls();
	}

	initializeForMap(DOMmap) {
		this.keyboardControls.initializeForMap(DOMmap);
		this.mouseControls.initializeForMap(DOMmap);
	}
}

export { Controls };
