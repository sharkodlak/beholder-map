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
		"9": Step.get(Step.TURN_RIGHT),
		"8": Step.get(Step.FORWARD),
		"7": Step.get(Step.TURN_LEFT),
		"6": Step.get(Step.STRAFE_RIGHT),
		"5": Step.get(Step.BACKWARD),
		"4": Step.get(Step.STRAFE_LEFT),
	}

	constructor() {
		document.addEventListener('keydown', this.onKeyDown.bind(this));
		document.addEventListener('keyup', this.onKeyUp.bind(this));
	}

	onKeyDown(event) {
		if (Keyboard.pressedKeys.has(event.key)) {
			return;
		}

		const keyValue = Keyboard.knownKeys[event.key];

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
