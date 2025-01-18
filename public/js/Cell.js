import { Mapper } from './Mapper.js';
import { Party } from './Party.js';


class Cell {
	block;
	domElement;
	x;
	y;
	north;
	west;
	east;
	south;

	constructor(block, domElement, x, y) {
		this.block = block;
		this.domElement = domElement;
		this.x = x;
		this.y = y;

		this.domElement.cell = this;
	}

	getDomElement() {
		return this.domElement;
	}

	getRelative(deltaX, deltaY) {
		if (deltaX === 0 && deltaY === 0) {
			return this;
		}

		let cell = this;

		if (deltaX > 0) {
			while (deltaX--) {
				cell = cell.east;
			}
		} else if (deltaX < 0) {
			while (deltaX++) {
				cell = cell.west;
			}
		}

		if (deltaY > 0) {
			while (deltaY--) {
				cell = cell.south;
			}
		} else if (deltaY < 0) {
			while (deltaY++) {
				cell = cell.north;
			}
		}

		return cell;
	}

	isPassable() {
		return Mapper.isPassable(this.block);
	}

	placeParty() {
		if (!this.isPassable()) {
			return;
		}

		Party.place(this);
	}

	setSouth(cell) {
		this.south = cell;
		this.south.north = this;
	}

	setEast(cell) {
		this.east = cell;
		this.east.west = this;
	}
}

export { Cell };
