class GameMap {
	map;
	stairs;

	static async load(file) {
		const response = await fetch(file);
		return await response.text();
	}

	static parse(mapText) {
		const map = [];
		const stairs = {};
		const lines = mapText.split("\n");
		let isReadingMap = true;

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
				const stair = line[0];
				const [x, y] = line.slice(2).split(", ").map(Number);
				stairs[stair] = [x, y];
			}
		});

		return new GameMap(map, stairs);
	}

	constructor(map, stairs) {
		this.map = map;
		this.stairs = stairs;
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
}

export { GameMap };
