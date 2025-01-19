import { Step } from "./Step.js";


class Direction {
	static NORTH = 'north';
	static SOUTH = 'south';
	static WEST = 'west';
	static EAST = 'east';

	static validDirections = new Set([
		Direction.NORTH,
		Direction.SOUTH,
		Direction.WEST,
		Direction.EAST
	]);

	static deltaX = {
		[Direction.NORTH]: 0,
		[Direction.SOUTH]: 0,
		[Direction.WEST]: -1,
		[Direction.EAST]: 1
	};

	static deltaY = {
		[Direction.NORTH]: -1,
		[Direction.SOUTH]: 1,
		[Direction.WEST]: 0,
		[Direction.EAST]: 0
	};

	static initial = Direction.get(Direction.SOUTH);

	static pool;

	static get(direction) {
		return Direction.initialize().get(direction);
	}

	static initialize() {
		if (!Direction.pool) {
			Direction.pool = new Map();
			Direction.validDirections.forEach((direction) => {
				Direction.pool.set(direction, new Direction(direction));
			});
		}

		return Direction.pool;
	}

	direction;

	constructor(direction) {
		if (!Direction.validDirections.has(direction)) {
			throw new Error(`Invalid direction: ${direction}`);
		}

		this.direction = direction;
	}

	getDirection() {
		return this.direction;
	}

	getDeltaX() {
		return Direction.deltaX[this.direction];
	}

	getDeltaY() {
		return Direction.deltaY[this.direction];
	}

	step(step) {
		if (step instanceof Step) {
			switch (step) {
				case Step.get(Step.TURN_LEFT):
					return this.turnLeft();
				case Step.get(Step.TURN_RIGHT):
					return this.turnRight();
			}
		}

		return this;
	}

	turnLeft() {
		switch (this.direction) {
			case Direction.NORTH:
				return Direction.get(Direction.WEST);
			case Direction.WEST:
				return Direction.get(Direction.SOUTH);
			case Direction.SOUTH:
				return Direction.get(Direction.EAST);
			case Direction.EAST:
				return Direction.get(Direction.NORTH);
		}
	}

	turnRight() {
		switch (this.direction) {
			case Direction.NORTH:
				return Direction.get(Direction.EAST);
			case Direction.EAST:
				return Direction.get(Direction.SOUTH);
			case Direction.SOUTH:
				return Direction.get(Direction.WEST);
			case Direction.WEST:
				return Direction.get(Direction.NORTH);
		}
	}
}

Direction.initialize();
Object.freeze(Direction);

export { Direction };
