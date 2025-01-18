import { Party } from '../Party.js';
import { Direction } from '../Direction.js';


class Keyboard {
	static pressedKeys = new Set();

	static keyToDirection = {
		"ArrowUp": Direction.get(Direction.NORTH),
		"ArrowDown": Direction.get(Direction.SOUTH),
		"ArrowLeft": Direction.get(Direction.WEST),
		"ArrowRight": Direction.get(Direction.EAST),
	};

	constructor() {
		document.addEventListener('keydown', this.onKeyDown.bind(this));
		document.addEventListener('keyup', this.onKeyUp.bind(this));
	}

	onKeyDown(event) {
		if (Keyboard.pressedKeys.has(event.key)) {
			return;
		}

		const direction = Keyboard.keyToDirection[event.key];

		if (direction) {
			Party.step(direction);
		}

		Keyboard.pressedKeys.add(event.key);
	}

	onKeyUp(event) {
		Keyboard.pressedKeys.delete(event.key);
	}

	initializeForMap(DOMmap) {
		// empty
	}
}

export { Keyboard };
