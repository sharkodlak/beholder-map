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

	constructor(map, stairs) {
		this.map = map;
		this.stairs = stairs;
	}

	generateMap() {
		const mapElement = document.getElementById("map");
		const lines = this.map.split("\n");
		lines.forEach((line, y) => {
			const row = document.createElement("tr");
			mapElement.appendChild(row);
			const firstCharPos = line.indexOf(line.trim()[0]);
			const lastCharPos = line.lastIndexOf(line.trim().slice(-1));
	
			for (let x = 0; x < line.length; x++) {
				const char = line[x];
				const cell = document.createElement("td");
				let item = char;

				if (x < firstCharPos || x > lastCharPos) {
					item = "+";
				}

				if (item in Mapper.items) {
					cell.className = Mapper.items[item];
				}

				for (const [stair, value] of Object.entries(this.stairs)) {
					if (value[0] === x && value[1] === y) {
						cell.textContent = stair;
					}
				}

				row.appendChild(cell);
			}
		});
		const row = document.createElement("tr");
	}
}

export { Mapper };
