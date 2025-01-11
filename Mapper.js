class Mapper {
	static items = {
		"@": "start",
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
		"4": "west stairs down",
		"3": "east stairs up",
		"2": "south stairs down",
		"1": "south stairs up",
	}

	generateMap() {
		const mapElement = document.getElementById("map");
		const lines = map.split("\n");
		lines.forEach(line => {
			const row = document.createElement("tr");
			mapElement.appendChild(row);
			const firstCharPos = line.indexOf(line.trim()[0]);
			const lastCharPos = line.lastIndexOf(line.trim().slice(-1));
	
			for (let i = 0; i < line.length; i++) {
				const char = line[i];
				const cell = document.createElement("td");
				let item = char;

				if (i < firstCharPos || i > lastCharPos) {
					item = "+";
				}

				cell.className = Mapper.items[item];
				//cell.textContent = char;
				row.appendChild(cell);
			}
		});
		const row = document.createElement("tr");
	}
}
