import { Direction } from '../Direction.js';
import { Party } from '../Party.js';
import { Step } from '../Step.js';


class Keyboard {
	static pressedKeys = new Set();

	static knownKeys = {
		"ArrowUp": Direction.get(Direction.NORTH),
		"ArrowDown": Direction.get(Direction.SOUTH),
		"ArrowLeft": Direction.get(Direction.WEST),
		"ArrowRight": Direction.get(Direction.EAST),
		"Numpad4": Step.get(Step.STRAFE_LEFT),
		"Numpad5": Step.get(Step.BACKWARD),
		"Numpad6": Step.get(Step.STRAFE_RIGHT),
		"Numpad7": Step.get(Step.TURN_LEFT),
		"Numpad8": Step.get(Step.FORWARD),
		"Numpad9": Step.get(Step.TURN_RIGHT),
	}

	constructor() {
		document.addEventListener('keydown', this.onKeyDown.bind(this));
		document.addEventListener('keyup', this.onKeyUp.bind(this));
	}

	onKeyDown(event) {
		if (Keyboard.pressedKeys.has(event.key)) {
			return;
		}

		const keyValue = Keyboard.knownKeys[event.code];

		if (keyValue instanceof Step) {
			Party.step(keyValue);
		}
		if (keyValue instanceof Direction) {
			Party.move(keyValue);
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
