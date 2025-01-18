import { Direction } from './Direction.js';
import { Step } from './Step.js';


class Party {
	static instance = null;

	mapper;
	direction;
	DOMcell;
	DOMelement;

	static place(DOMcell, direction) {
		if (!Party.instance) {
			return new Party(DOMcell, direction);
		}

		Party.instance.reset(DOMcell, direction);
	}

	static step(step) {
		Party.instance.step(step);
	}

	constructor(DOMcell, direction) {
		if (Party.instance) {
			throw new Error('Only one instance of party is possible.');
		}

		this.initialize();
		this.mapper = DOMcell.parentElement.parentElement.mapper;
		this.DOMcell = DOMcell;
		this.direction = direction || Direction.initial;

		Party.instance = this;
		DOMcell.appendChild(this.DOMelement);
	}

	initialize() {
		let DOMelement = document.getElementById("party");

		if (!DOMelement) {
			DOMelement = document.createElement("div");
			DOMelement.id = "party";
		}

		this.DOMelement = DOMelement;
	}

	getCell() {
		return this.cell;
	}

	getDirection() {
		return this.direction;
	}

	reset(DOMcell, direction) {
		this.DOMcell.removeChild(this.DOMelement);
		this.DOMcell = DOMcell;
		this.direction = direction || this.direction;
		DOMcell.appendChild(this.DOMelement);
	}

	step(step) {
		this.direction = this.direction.step(step);
	}
}

export { Party };
