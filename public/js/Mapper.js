import { Cell } from "./Cell.js";


class Mapper {
	static blockGroups = {
		"basic": {
			" ": "hallway",
			"_": "pressure-plate",
			"*": "teleport visible",
			"↷": "rotator deg90 clockwise",
			"↶": "rotator deg90 counter-clockwise",
			"↻": "rotator deg180",
		},
		"blocks": {
			"#": "block",
			"+": "expected block",
			"=": "imaginary block",
			"⊙": "pedestal",
			"◉": "pedestal eye",
			"?": "unknown",
		},
		"button": {
			"↑": "button north",
			"←": "button west",
			"→": "button east",
			"↓": "button south",
			"↕": "button north south",
		},
		"door": {
			"-": "door east-west",
			"|": "door north-south",
		},
		"hole": {
			",": "floor hole",
			".": "ceiling hole",
			";": "floor ceiling hole",
		},
		"keyhole": {
			"⇧": "keyhole north",
			"⇦": "keyhole west",
			"⇨": "keyhole east",
			"⇩": "keyhole south",
			"⇕": "keyhole north south",
			"⇔": "keyhole east west",
		},
		/*
		"niche": {
			"̲": "niche north",
			"̸": "niche west",
			"̷": "niche east",
			"̅ ": "niche south",
		},
		*/
		"ancient portal": {
			"⏶": "north ancient portal",
			"⏴": "west ancient portal",
			"⏵": "east ancient portal",
			"⏷": "south ancient portal",
		},
		// For understanding following numbers consider player on number 5
		"stairs up": {
			"9": "north stairs up",
			"7": "west stairs up",
			"3": "east stairs up",
			"1": "south stairs up",
		},
		"stairs down": {
			"8": "north stairs down",
			"4": "west stairs down",
			"6": "east stairs down",
			"2": "south stairs down",
		},
		"xtra": {
			"^": "start",
			"☥": "dvarwen cleric",
			"👀": "beholder",
			"✝": "grave",
			"✚": "altar",
			"&": "npc",
		},
	};

	static blocks = Object.assign({}, ...Object.values(Mapper.blockGroups));

	static passableBlocks = " =,.;-|_↑←→↓↕⇧⇦⇨⇩*☥✝?&";

	static cellCreator = {
		"button north south": (domCell) => {
			domCell.className = "button north";
			const domAnotherButton = document.createElement("div");
			domAnotherButton.className = "button south";
			domAnotherButton.appendChild(document.createElement("div"));
			domCell.appendChild(domAnotherButton);
		},
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

	static getAvailableBlocks() {
		const availableBlocks = Object.entries(Mapper.blockGroups).filter(([key, value]) => key !== "xtra").map(([key, value]) => Object.keys(value));
		const availableBlocksVertical = availableBlocks.map((_, colIndex) => availableBlocks.map(row => row[colIndex])).filter(row => row.some(block => block !== undefined));
		console.log("Available blocks: ", availableBlocks, availableBlocksVertical);
		return availableBlocksVertical;
	}

	static pairCells(srcCell, dstCell, options = {}) {
		options.classList = options.classList || [];
		options.classList.push("pair");
		srcCell.domElement.classList.add(...options.classList);

		options.classList.push("destination");
		dstCell.domElement.classList.add(...options.classList);

		if (options.name) {
			srcCell.domElement.title = options.name;
			dstCell.domElement.title = options.name;
		}

		options.twoWay
			? srcCell.setTwoWayDestination(dstCell)
			: srcCell.setDestination(dstCell)
		;
	}

	cells;
	level;
	map;
	previousLevel;
	nextLevel;

	constructor(map, previousLevel) {
		this.map = map;
		this.previousLevel = previousLevel;
		this.setLevel();
	}

	setLevel() {
		this.level = (this.previousLevel?.level || 0) + 1;
	}

	setNextLevel(nextLevel) {
		this.nextLevel = nextLevel;
	}

	getLevel(levelNumber) {
		let current = this;

		while (current.level !== levelNumber) {
			current = current.level > levelNumber ? current.previousLevel : current.nextLevel;
		}

		return current;
	}

	getPreviousLevel() {
		return this.previousLevel;
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

				for (const [poiX, poiY] of this.map.pointsOfInterest) {
					if (poiX === x && poiY === y) {
						domCell.classList.add("poi");
					}
				}

				for (const [portalNumber, portal] of Object.entries(this.map.portals || {})) {
					if (portal.position[0] === x && portal.position[1] === y) {
						const domLabel = document.createElement("span");
						domLabel.textContent = portal.label || portalNumber;
						domCell.appendChild(domLabel);
					}
				}

				for (const [stairsCharacter, value] of Object.entries(this.map.stairs)) {
					if (value[0] === x && value[1] === y) {
						const domLabel = document.createElement("span");
						domLabel.textContent = stairsCharacter;
						domCell.appendChild(domLabel);
					}
				}

				domRow.appendChild(domCell);

				const northcell = cells[y - 1] && cells[y - 1][x];
				const westcell = cells[y][x - 1];
				const cell = new Cell(block, domCell, x, y, this.level);
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

		this.cells = cells;

		cells.forEach((row, y) => {
			row.forEach((cell, x) => {
				if (this.map.holes.length > 0) {
					let offset;

					if (Mapper.blockGroups["hole"][cell.block]?.includes("ceil")) {
						holesIterator: for (const holeGroup of this.map.holes) {
							if (holeGroup.positions) {
								for (const [holeX, holeY] of holeGroup.positions ?? []) {
									if (holeX === x && holeY === y) {
										offset = holeGroup;
										break holesIterator;
									}
								}
							}

							offset = holeGroup;
						}

						const floorCells = offset.sameLevel ? this.cells : this.previousLevel.cells;
						const dstX = x - offset.x;
						const dstY = y - offset.y;
						const floorCell = floorCells[dstY][dstX];

						Mapper.pairCells(floorCell, cell);
					}
				}

				if (Object.keys(this.map.stairs).length > 0) {
					if (Mapper.blockGroups["stairs up"][cell.block] || Mapper.blockGroups["stairs down"][cell.block]) {
						for (const [stairsCharacter, value] of Object.entries(this.map.stairs)) {
							if (value[0] === x && value[1] === y) {
								const oppositeCaseCharacter = stairsCharacter === stairsCharacter.toLowerCase()
									? stairsCharacter.toUpperCase()
									: stairsCharacter.toLowerCase()
								;
								const stairsMapper = this.map.stairs[oppositeCaseCharacter] ? this
									: this.previousLevel?.map.stairs[oppositeCaseCharacter] ? this.previousLevel
									: this.nextLevel;

								if (!stairsMapper) {
									continue;
								}

								const [dstX, dstY] = stairsMapper.map.stairs[oppositeCaseCharacter];
								const dstCell = stairsMapper.cells[dstY][dstX];

								Mapper.pairCells(cell, dstCell, { twoWay: true });
							}
						}
					}
				}
			});
		});

		this.map.teleports.forEach(([srcX, srcY, dstX, dstY, name]) => {
			const srcCell = cells[srcY][srcX];
			const dstCell = cells[dstY][dstX];

			Mapper.pairCells(srcCell, dstCell, { classList: ['teleport'], name });
		});

		return domMap;
	}

	getCell(x, y) {
		return this.cells[y][x];
	}

	pairPortalCells() {
		this.cells.forEach((row, y) => {
			row.forEach((cell, x) => {
				if (Object.keys(this.map.portals).length > 0) {
					if (Mapper.blockGroups["ancient portal"][cell.block]) {
						for (const [, portal] of Object.entries(this.map.portals)) {
							if (portal.destination === undefined) {
								continue;
							}

							const dstLevelNumber = portal.destination?.[2]
								? parseInt(portal.destination[2].substr(6))
								: this.level
							;

							if (portal.position[0] === x && portal.position[1] === y) {
								const dstLevel = this.getLevel(dstLevelNumber);
								const dstCell = dstLevel.getCell(portal.destination[0], portal.destination[1]);
								Mapper.pairCells(cell, dstCell);
							}
						}
					}
				}
			});
		});
	}
}

export { Mapper };
