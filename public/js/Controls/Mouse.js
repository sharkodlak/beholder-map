import { Party } from '../Party.js';


class Mouse {
	initializeForMap(DOMmap) {
		DOMmap.addEventListener('click', this.onClick.bind(this));
		DOMmap.addEventListener('mousedown', this.onMouseDown.bind(this));
		DOMmap.addEventListener('mouseover', this.onMouseOver.bind(this));
		DOMmap.addEventListener('mouseout', this.onMouseOut.bind(this));
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

	onMouseOver(event) {
		const cell = this.getCell(event);

		if (!cell || !cell.domElement) {
			return;
		}

		if (cell.domElement.classList.contains("pair")) {
			cell.domElement.classList.add("highlight");

			if (cell.destination) {
				cell.destination.domElement.classList.add("highlight");
			} else {
				cell.sources.forEach(source => source.domElement.classList.add("highlight"));
			}
		}
	}

	onMouseOut(event) {
		const cell = this.getCell(event);

		if (!cell || !cell.domElement) {
			return;
		}

		if (cell.domElement.classList.contains("pair")) {
			cell.domElement.classList.remove("highlight");

			if (cell.destination) {
				cell.destination.domElement.classList.remove("highlight");
			} else {
				cell.sources.forEach(source => source.domElement.classList.remove("highlight"));
			}
		}
	}

	getCell(event) {
		const domCell = event.target.closest("td");

		if (!domCell) {
			return;
		}

		return domCell.cell;
	}
}

export { Mouse };
