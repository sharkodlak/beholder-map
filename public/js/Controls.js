import { Keyboard as KeyboardControls } from './Controls/Keyboard.js';
import { Mouse as MouseControls } from './Controls/Mouse.js';
import { Touch as TouchControls } from './Controls/Touch.js';


class Controls {
	static instance;

	static initialize() {
		if (!Controls.instance) {
			Controls.instance = new Controls();
		}

		return Controls.instance;
	}

	keyboardControls;
	mouseControls;
	touchControls;

	constructor() {
		this.keyboardControls = new KeyboardControls();
		this.mouseControls = new MouseControls();
		this.touchControls = new TouchControls();
	}

	initializeForMap(DOMmap) {
		this.keyboardControls.initializeForMap(DOMmap);
		this.mouseControls.initializeForMap(DOMmap);
		this.touchControls.initializeForMap(DOMmap);
	}
}

export { Controls };
