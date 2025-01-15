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

	static passableBlocks = " =.-|_↑←→↓⇧⇦⇨⇩*";

	static cellCreator = {
		"ceiling hole": (cellElement) => {
			const holeElement = document.createElement("div");
			holeElement.className = "ceiling hole";
			cellElement.appendChild(holeElement);
		}
	};

	map;

	constructor(map) {
		this.map = map;
	}

	generateMap(elementId) {
		const mapElement = document.getElementById(elementId);
		this.map.forEach((row, y) => {
			const rowElement = document.createElement("tr");
			mapElement.appendChild(rowElement);

			row.forEach((item, x) => {
				const cellElement = document.createElement("td");

				if (x < row.firstBlockPosition || x > row.lastBlockPosition) {
					item = "+";
				}

				if (item in Mapper.items) {
					const longName = Mapper.items[item];
					const creatorKey = Object.keys(Mapper.cellCreator).find((key) => longName.indexOf(key) !== -1);
					cellElement.className = longName;

					if (creatorKey) {
						Mapper.cellCreator[creatorKey](cellElement);
					}
				}

				for (const [stair, value] of Object.entries(this.map.stairs)) {
					if (value[0] === x && value[1] === y) {
						const stairElement = document.createElement("div");
						stairElement.className = "shape";
						cellElement.appendChild(stairElement);

						const stairLabelElement = document.createElement("span");
						stairLabelElement.textContent = stair;
						cellElement.appendChild(stairLabelElement);
					}
				}

				rowElement.appendChild(cellElement);
			});
		});
	}
}

export { Mapper };
