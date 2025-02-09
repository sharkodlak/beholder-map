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
	teleportDestination;
	teleportSource;

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
		deltaX = parseInt(deltaX);
		deltaY = parseInt(deltaY);

		let cell = this;

		if (deltaX > 0) {
			cell = cell.getEast(deltaX);
		} else if (deltaX < 0) {
			cell = cell.getWest(-deltaX);
		}

		if (deltaY > 0) {
			cell = cell.getSouth(deltaY);
		} else if (deltaY < 0) {
			cell = cell.getNorth(-deltaY);
		}

		return cell;
	}

	getNorth(delta) {
		let cell = this;

		while (delta--) {
			cell = cell.north;
		}

		return cell;
	}

	getWest(delta) {
		let cell = this;

		while (delta--) {
			cell = cell.west;
		}

		return cell;
	}

	getEast(delta) {
		let cell = this;

		while (delta--) {
			cell = cell.east;
		}

		return cell;
	}

	getSouth(delta) {
		let cell = this;

		while (delta--) {
			cell = cell.south;
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

	setTeleportDestination(cell) {
		this.teleportDestination = cell;
		cell.teleportSource = this;
	}
}

export { Cell };
