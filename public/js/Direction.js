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

	static pool = new Map();

	static initialize() {
		Direction.validDirections.forEach((direction) => {
			Direction.pool.set(direction, new Direction(direction));
		});
	}

	static initial = Direction.pool.get(Direction.SOUTH);

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

	step(step) {
		switch (step) {
			case Step.TURN_LEFT:
				return this.turnLeft();
			case Step.TURN_RIGHT:
				return this.turnRight();
			default:
				return this;
		}
	}

	turnLeft() {
		switch (this) {
			case Direction.pool.get(Direction.NORTH):
				return Direction.pool.get(Direction.WEST);
			case Direction.pool.get(Direction.WEST):
				return Direction.pool.get(Direction.SOUTH);
			case Direction.pool.get(Direction.SOUTH):
				return Direction.pool.get(Direction.EAST);
			case Direction.pool.get(Direction.EAST):
				return Direction.pool.get(Direction.NORTH);
		}
	}

	turnRight() {
		switch (this) {
			case Direction.pool.get(Direction.NORTH):
				return Direction.pool.get(Direction.EAST);
			case Direction.pool.get(Direction.EAST):
				return Direction.pool.get(Direction.SOUTH);
			case Direction.pool.get(Direction.SOUTH):
				return Direction.pool.get(Direction.WEST);
			case Direction.pool.get(Direction.WEST):
				return Direction.pool.get(Direction.NORTH);
		}
	}
}

Direction.initialize();
Object.freeze(Direction);

export { Direction };
