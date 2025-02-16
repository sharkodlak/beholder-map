import { Party } from '../Party.js';


class Mouse {
	initializeForMap(DOMmap) {
		DOMmap.addEventListener('click', this.onClick.bind(this));
		DOMmap.addEventListener('dblclick', this.onDoubleClick.bind(this));
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

	onDoubleClick(event) {
		const cell = this.getCell(event);

		if (cell) {
			cell.togglePairPermanentHighlight();
			cell.destinationScrollIntoView();
		}
	}

	onMouseDown(event) {
		const cell = this.getCell(event);

		if (!cell) {
			return;
		}

		if (event.button === 1) {
			console.log(cell);
			cell.togglePairPermanentHighlight();
		}
	}

	onMouseOver(event) {
		const cell = this.getCell(event);

		if (!cell || !cell.domElement) {
			return;
		}

		cell.pairHighlight();
	}

	onMouseOut(event) {
		const cell = this.getCell(event);

		if (!cell || !cell.domElement) {
			return;
		}

		cell.pairRemoveHighlight();
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
