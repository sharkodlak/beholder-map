import { Party } from '../Party.js';


class Mouse {
	initializeForMap(DOMmap) {
		DOMmap.addEventListener('click', this.onClick.bind(this));
		DOMmap.addEventListener('mousedown', this.onMouseDown.bind(this));
	}

	onClick(event) {
		const cell = this.getCell(event);

		if (cell) {
			Party.place(cell);
		}
	}

	onMouseDown(event) {
		const cell = this.getCell(event);

		if (!cell) {
			return;
		}

		if (event.button === 1) {
			console.log(cell);
		}
	}

	getCell(event) {
		return event.target.closest("td").cell;
	}
}

export { Mouse };
