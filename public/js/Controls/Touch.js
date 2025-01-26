import { Party } from '../Party.js';


class Touch {
	static PRESS_DURATION = 500;
	static DOUBLE_TAP_DURATION = 300;

	touchTimer;
	lastTouchTime = 0;

	initializeForMap(DOMmap) {
		DOMmap.addEventListener('touchstart', this.onTouchStart.bind(this));
		DOMmap.addEventListener('touchend', this.onTouchEnd.bind(this));
		DOMmap.addEventListener('touchcancel', this.onTouchCancel.bind(this));
	}

	onTouchStart(event) {
		const cell = this.getCell(event);

		if (cell) {
			Party.place(cell);
		}

		const currentTime = new Date().getTime();
		const tapDuration = currentTime - this.lastTouchTime;

		if (tapDuration > 0 && tapDuration <= Touch.DOUBLE_TAP_DURATION) {
			this.onDoubleTap(event, cell);
		} else {
			this.touchTimer = setTimeout(() => {
				this.onPress(event, cell);
			}, Touch.PRESS_DURATION);
		}

		this.lastTouchTime = currentTime;
	}

	onTouchEnd(event) {
		clearTimeout(this.touchTimer);
	}

	onTouchCancel(event) {
		clearTimeout(this.touchTimer);
	}

	onDoubleTap(event, cell) {
		console.log(cell, event);
	}

	onPress(event, cell) {
		console.log(cell, event);
	}

	getCell(event) {
		const domCell = event.target.closest("td");

		if (!domCell) {
			return;
		}

		return domCell.cell;
	}
}

export { Touch };
