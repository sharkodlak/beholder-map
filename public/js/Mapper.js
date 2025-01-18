import { Cell } from "./Cell.js";


class Mapper {
	static blocks = {
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
		"ceiling hole": (domCell) => {
			const domHole = document.createElement("div");
			domHole.className = "ceiling hole";
			domCell.appendChild(domHole);
		},
		"stairs": (domCell) => {
			const domStairs = document.createElement("div");
			domStairs.className = "stairs";
			domCell.appendChild(domStairs);
		}
	};

	static isPassable(block) {
		return Mapper.passableBlocks.includes(block);
	}

	getRelativeCell(x,y) {
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
	previousLevel;
	nextLevel;

	constructor(map, previousLevel) {
		this.map = map;
		this.previousLevel = previousLevel;
	}

	setNextLevel(nextLevel) {
		this.nextLevel = nextLevel;
	}

	generateMap(elementId) {
		const domMap = document.getElementById(elementId);
		domMap.mapper = this;
		let cells = [];
		this.map.forEach((row, y) => {
			const domRow = document.createElement("tr");
			domMap.appendChild(domRow);
			cells[y] = [];

			row.forEach((block, x) => {
				const domCell = document.createElement("td");

				if (x < row.firstBlockPosition || x > row.lastBlockPosition) {
					block = "+";
				}

				if (block in Mapper.blocks) {
					const domDiv = document.createElement("div");
					const longName = Mapper.blocks[block];
					const creatorKey = Object.keys(Mapper.cellCreator).find((key) => longName.indexOf(key) !== -1);
					domCell.appendChild(domDiv);
					domCell.className = longName;

					if (creatorKey) {
						Mapper.cellCreator[creatorKey](domCell);
					}
				}

				for (const [stair, value] of Object.entries(this.map.stairs)) {
					if (value[0] === x && value[1] === y) {
						const domStairLabel = document.createElement("span");
						domStairLabel.textContent = stair;
						domCell.appendChild(domStairLabel);
					}
				}

				domRow.appendChild(domCell);

				const northcell = cells[y - 1] && cells[y - 1][x];
				const westcell = cells[y][x - 1];
				const cell = new Cell(block, domCell, x, y);
				cells[y][x] = cell;

				if (typeof westcell !== "undefined") {
					westcell.setEast(cell);
				}

				if (typeof northcell !== "undefined") {
					northcell.setSouth(cell);
				}

				if (x === this.map.getWidth() - 1) {
					cell.setEast(cells[y][0]);
				}

				if (y === this.map.getHeight() - 1) {
					cell.setSouth(cells[0][x]);
				}
			});
		});

		return domMap;
	}

	getCellElement(cell, deltaX, deltaY) {
		if (deltaX === undefined) {
			deltaX = 0;
		}

		if (deltaY === undefined) {
			deltaY = 0;
		}

		const domMap = cell.parentElement.parentElement;
		const x = ((cell.cellIndex + deltaX) % this.map.getWidth() + this.map.getWidth()) % this.map.getWidth();
		const y = ((cell.parentElement.rowIndex + deltaY) % this.map.getHeight() + this.map.getHeight()) % this.map.getHeight();
		const destinationRow = domMap.children[y];

		return destinationRow.children[x];
	}
}

export { Mapper };
