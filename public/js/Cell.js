import { Mapper } from './Mapper.js';
import { Party } from './Party.js';


class Cell {
	block;
	domElement;
	level;
	x;
	y;
	north;
	west;
	east;
	south;
	destination;
	sources = [];

	constructor(block, domElement, x, y, level) {
		this.block = block;
		this.domElement = domElement;
		this.x = x;
		this.y = y;
		this.level = level;

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

	pairHighlight(permanent = false) {
		if (this.domElement.classList.contains("pair")) {
			const classList = ["highlight"];

			if (permanent) {
				classList.push("permanent");
			}

			this.domElement.classList.add(...classList);

			if (this.destination) {
				this.destination.domElement.classList.add(...classList);
			} else {
				this.sources.forEach(source => source.domElement.classList.add(...classList));
			}
		}
	}

	pairRemoveHighlight(permanent = false) {
		if (this.domElement.classList.contains("pair")) {
			const classList = ["highlight"];

			if (permanent) {
				classList.push("permanent");
			}

			if (permanent || !this.domElement.classList.contains("permanent")) {
				this.domElement.classList.remove(...classList);
			}

			if (this.destination) {
				if (permanent || !this.destination.domElement.classList.contains("permanent")) {
					this.destination.domElement.classList.remove(...classList);
				}
			} else {
				this.sources.forEach(
					source => (permanent || !source.domElement.classList.contains("permanent"))
						&& source.domElement.classList.remove(...classList)
				);
			}
		}
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

	setDestination(cell) {
		this.destination = cell;
		cell.sources.push(this);
	}

	setTwoWayDestination(cell) {
		this.setDestination(cell);
		cell.setDestination(this);
	}

	togglePairPermanentHighlight() {
		if (this.domElement.classList.contains("permanent")) {
			this.pairRemoveHighlight(true);
		} else {
			this.pairHighlight(true);
		}
	}
}

export { Cell };
