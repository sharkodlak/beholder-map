import { GameMap } from "./GameMap.js";

class Mapper {
	static items = {
		"^": "start",
		"#": "block",
		"+": "expected block",
		",": "floor hole",
		".": "ceiling hole",
		";": "floor ceiling hole",
		"-": "door east-west",
		"|": "door north-south",
		"_": "pressure plate",
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
	}

	map;

	constructor(map) {
		this.map = map;
	}

	generateMap() {
		const mapElement = document.getElementById("map");
		this.map.forEach((row, y) => {
			const rowElement = document.createElement("tr");
			mapElement.appendChild(rowElement);

			row.forEach((item, x) => {
				const cellElement = document.createElement("td");

				if (x < row.firstBlockPosition || x > row.lastBlockPosition) {
					item = "+";
				}

				if (item in Mapper.items) {
					cellElement.className = Mapper.items[item];
				}

				for (const [stair, value] of Object.entries(this.map.stairs)) {
					if (value[0] === x && value[1] === y) {
						cellElement.textContent = stair;
					}
				}

				rowElement.appendChild(cellElement);
			});
		});
	}
}

export { Mapper };
