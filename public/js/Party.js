import { Direction } from './Direction.js';
import { Step } from './Step.js';


class Party {
	static instance = null;

	cell;
	direction;
	domElement;
	mapper;

	static get() {
		return Party.instance;
	}

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
		this.cell = cell;
		this.direction = direction || Direction.initial;
		this.mapper = domCell.parentElement.parentElement.mapper;
		this.initialize();

		Party.instance = this;
		domCell.appendChild(this.domElement);
	}

	initialize() {
		let domElement = document.getElementById("party");

		if (!domElement) {
			domElement = document.createElement("div");
			domElement.id = "party";
			domElement.className = this.direction.getDirection();
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
		const destinationCell = this.cell.getRelative(direction.getDeltaX(), direction.getDeltaY());
		destinationCell.placeParty();
	}

	reset(cell, direction) {
		this.cell = cell;
		this.direction = direction || this.direction;
		this.domElement.className = this.direction.getDirection();
		const domCell = cell.getDomElement();
		domCell.appendChild(this.domElement);
	}

	step(step) {
		this.direction = this.direction.step(step);
		const destinationCell = this.cell.getRelative(step.getDeltaX(this.direction), step.getDeltaY(this.direction));
		destinationCell.placeParty();
	}
}

globalThis.Party = Party;

export { Party };
