class Map {
	map;
	stairs;

	static async load(file) {
		const response = await fetch(file);
		return await response.text();
	}

	static fromText(mapText) {
		const map = [];
		const stairs = {};
		const lines = text.split("\n");
		const lineLength = lines[0].length;
		let isReadingMap = true;

		lines.forEach((line, y) => {
			if (line === "") {
				isReadingMap = false;
			}

			if (isReadingMap) {
				for (let x = 0; x < line.length; x++) {
					const char = line[x];
					map[y * lineLength + x] = char;
				}
			} else {
				const stair = line[0];
				const [x, y] = line.slice(2).split(", ").map(Number);
				stairs[stair] = [x, y];
			}
		});

		return new Map(map, stairs);
	}

	constructor(map, stairs) {
		this.map = map;
		this.stairs = stairs;
	}
}

export { Map };
