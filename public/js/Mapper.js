import { GameMap } from "./GameMap.js";

class Mapper {
	static items = {
		"^": "start",
		"#": "block",
		"=": "imaginary block",
		"+": "expected block",
		",": "floor hole",
		".": "ceiling hole",
		";": "floor ceiling hole",
		"-": "door east-west",
		"|": "door north-south",
		"_": "pressure-plate",
		"↑": "button north",
		"←": "button west",
		"→": "button east",
		"↓": "button south",
		"⇧": "keyhole north",
		"⇦": "keyhole west",
		"⇨": "keyhole east",
		"⇩": "keyhole south",
		"̲": "niche north",
		"̸": "niche west",
		"̷": "niche east",
		"̅ ": "niche south",
		"*": "teleport",
		// For understanding following numbers consider player on number 5
		"9": "north stairs up",
		"8": "north stairs down",
		"7": "west stairs up",
		"6": "east stairs down",
		// "5" can be used for something else
		"4": "west stairs down",
		"3": "east stairs up",
		"2": "south stairs down",
		"1": "south stairs up",
	};

	static passableBlocks = " =,.;-|_↑←→↓⇧⇦⇨⇩*";

	static cellCreator = {
		"ceiling hole": (cellElement) => {
			const holeElement = document.createElement("div");
			holeElement.className = "ceiling hole";
			cellElement.appendChild(holeElement);
		},
		"stairs": (cellElement) => {
			const stairsElement = document.createElement("div");
			stairsElement.className = "stairs";
			cellElement.appendChild(stairsElement);
		}
	};

	static keyToDirection = {
		"ArrowUp": "north",
		"ArrowDown": "south",
		"ArrowLeft": "west",
		"ArrowRight": "east"
	};

	static usedByParty;

	static pressedKeys = new Set();

	static onKeyDown(event) {
		if (Mapper.pressedKeys.has(event.key)) {
			return;
		}

		const direction = Mapper.keyToDirection[event.key];

		if (direction) {
			Mapper.moveParty(direction);
		}

		Mapper.pressedKeys.add(event.key);
	}

	static onKeyUp(event) {
		Mapper.pressedKeys.delete(event.key);
	}

	static moveParty(direction) {
		const partyElement = document.getElementById("party");

		if (!partyElement) {
			return;
		}

		partyElement.className = direction;
		const cell = partyElement.parentElement;
		let deltaX;
		let deltaY;

		switch (direction) {
			case "north":
				deltaY = -1;
				break;
			case "south":
				deltaY = 1;
				break;
			case "west":
				deltaX = -1;
				break;
			case "east":
				deltaX = 1;
				break;
		}

		const newCell = Mapper.usedByParty.getCellElement(cell, deltaX, deltaY);

		if (!Mapper.usedByParty.isPassable(newCell)) {
			return;
		}

		partyElement.remove();
		newCell.appendChild(partyElement);
	}

	map;

	constructor(map) {
		this.map = map;
	}

	generateMap(elementId) {
		const mapElement = document.getElementById(elementId);
		mapElement.addEventListener("click", this.onCellClick.bind(this));
		this.map.forEach((row, y) => {
			const rowElement = document.createElement("tr");
			mapElement.appendChild(rowElement);

			row.forEach((item, x) => {
				const cellElement = document.createElement("td");

				if (x < row.firstBlockPosition || x > row.lastBlockPosition) {
					item = "+";
				}

				if (item in Mapper.items) {
					const divElement = document.createElement("div");
					const longName = Mapper.items[item];
					const creatorKey = Object.keys(Mapper.cellCreator).find((key) => longName.indexOf(key) !== -1);
					cellElement.appendChild(divElement);
					cellElement.className = longName;

					if (creatorKey) {
						Mapper.cellCreator[creatorKey](cellElement);
					}
				}

				for (const [stair, value] of Object.entries(this.map.stairs)) {
					if (value[0] === x && value[1] === y) {
						const stairLabelElement = document.createElement("span");
						stairLabelElement.textContent = stair;
						cellElement.appendChild(stairLabelElement);
					}
				}

				rowElement.appendChild(cellElement);
			});
		});
	}

	onCellClick(event) {
		const cell = event.target.closest("td");

		if (cell) {
			this.placeParty(cell);
		}
	}

	placeParty(cell) {
		if (!this.isPassable(cell)) {
			return;
		}

		let partyElement = document.getElementById("party");

		if (partyElement) {
			partyElement.remove();
		} else {
			partyElement = document.createElement("div");
			partyElement.id = "party";
		}

		cell.appendChild(partyElement);
		Mapper.usedByParty = this;
	}

	isPassable(cell) {
		const cellCoordinates = this.getCellCoordinates(cell);
		const block = this.map.getCell(cellCoordinates.x, cellCoordinates.y);

		return Mapper.passableBlocks.includes(block);
	}

	getCellCoordinates(cell) {
		const x = cell.cellIndex;
		const y = cell.parentElement.rowIndex;

		return { x, y };
	}

	getCellElement(cell, deltaX, deltaY) {
		if (deltaX === undefined) {
			deltaX = 0;
		}

		if (deltaY === undefined) {
			deltaY = 0;
		}

		const mapElement = cell.parentElement.parentElement;
		const x = ((cell.cellIndex + deltaX) % this.map.getWidth() + this.map.getWidth()) % this.map.getWidth();
		const y = ((cell.parentElement.rowIndex + deltaY) % this.map.getHeight() + this.map.getHeight()) % this.map.getHeight();
		const destinationRow = mapElement.children[y];

		return destinationRow.children[x];
	}
}

export { Mapper };
