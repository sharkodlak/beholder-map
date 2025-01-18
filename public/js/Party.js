import { Direction } from './Direction.js';
import { Step } from './Step.js';


class Party {
	static instance = null;

	cell;
	direction;
	domElement;
	mapper;

	static move(direction) {
		Party.instance.move(direction);
	}

	static place(cell, direction) {
		if (!Party.instance) {
			return new Party(cell, direction);
		}

		Party.instance.reset(cell, direction);
	}

	static step(step) {
		Party.instance.step(step);
	}

	constructor(cell, direction) {
		if (Party.instance) {
			throw new Error('Only one instance of party is possible.');
		}

		const domCell = cell.getDomElement();
		this.initialize();
		this.cell = cell;
		this.direction = direction || Direction.initial;
		this.mapper = domCell.parentElement.parentElement.mapper;

		Party.instance = this;
		domCell.appendChild(this.domElement);
	}

	initialize() {
		let domElement = document.getElementById("party");

		if (!domElement) {
			domElement = document.createElement("div");
			domElement.id = "party";
		}

		this.domElement = domElement;
	}

	getCell() {
		return this.cell;
	}

	getDirection() {
		return this.direction;
	}

	move(direction) {
		this.direction = direction;
		const destinationCell = this.cell.getRelative(direction.getDeltaX(), direction.getDeltaY());
		destinationCell.placeParty();
	}

	reset(cell, direction) {
		const previousDomCell = this.cell.getDomElement();
		previousDomCell.removeChild(this.domElement);
		this.cell = cell;
		this.direction = direction || this.direction;
		const domCell = cell.getDomElement();
		domCell.appendChild(this.domElement);
	}

	step(step) {
		this.direction = this.direction.step(step);
	}
}

export { Party };
