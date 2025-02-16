class GameMap {
	holes;
	map;
	pointsOfInterest;
	portals;
	stairs;
	teleports;

	static async load(file) {
		const response = await fetch(file);
		return await response.text();
	}

	static parse(mapText) {
		const map = [];
		const stairs = {};
		const lines = mapText.split("\n");
		let isReadingMap = true;
		let structuresSource = '';

		lines.forEach((line, y) => {
			if (line === "") {
				isReadingMap = false;
				return;
			}

			if (isReadingMap) {
				if (typeof map[y] === "undefined") {
					map[y] = [];
				}

				map[y].firstBlockPosition = line.indexOf(line.trim()[0]);
				map[y].lastBlockPosition = line.lastIndexOf(line.trim().slice(-1));

				if (map[y].firstBlockPosition === -1) {
					map[y].firstBlockPosition = line.length;
				}

				for (let x = 0; x < line.length; x++) {
					const char = line[x];
					map[y][x] = char;
				}
			} else {
				structuresSource += line + "\n";
			}
		});

		const structures = JSON.parse(structuresSource);

		return new GameMap(map, structures);
	}

	constructor(map, structures) {
		structures = structures || {};
		this.map = map;

		this.holes = structures.holes || [];
		this.pointsOfInterest = structures.pointsOfInterest || [];
		this.portals = structures.portals || {};
		this.stairs = structures.stairs || {};
		this.teleports = structures.teleports || [];
	}

	forEach(callback) {
		const frozenMap = Object.freeze(
			this.map.map(row => {
				return Object.freeze(row);
			})
		);
		frozenMap.forEach((row, y) => {
			callback(row, y, frozenMap);
		});
	}

	getHeight() {
		return this.map.length;
	}

	getWidth() {
		return this.map[0].length;
	}

	getCell(x, y) {
		return this.map[y][x];
	}
}

export { GameMap };
