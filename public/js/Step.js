class Step {
	static FORWARD = 'forward';
	static BACKWARD = 'backward';
	static STRAFE_LEFT = 'strafe-left';
	static STRAFE_RIGHT = 'strafe-right';
	static TURN_LEFT = 'turn-left';
	static TURN_RIGHT = 'turn-right';

	static validSteps = new Set([
		Step.FORWARD,
		Step.BACKWARD,
		Step.STRAFE_LEFT,
		Step.STRAFE_RIGHT,
		Step.TURN_LEFT,
		Step.TURN_RIGHT
	]);

	static pool;

	static get(step) {
		return Step.initialize().get(step);
	}

	static initialize() {
		if (!Step.pool) {
			Step.pool = new Map();
			Step.validSteps.forEach((step) => {
				Step.pool.set(step, new Step(step));
			});
		}

		return Step.pool;
	}

	step;

	constructor(step) {
		if (!Step.validSteps.has(step)) {
			throw new Error(`Invalid step: ${step}`);
		}

		this.step = step;
	}

	getDeltaX(direction) {
		switch (this.step) {
			case Step.FORWARD:
				return direction.getDeltaX();
			case Step.BACKWARD:
				return -direction.getDeltaX();
			case Step.STRAFE_LEFT:
				return direction.getDeltaY();
			case Step.STRAFE_RIGHT:
				return -direction.getDeltaY();
		}

		return 0;
	}

	getDeltaY(direction) {
		switch (this.step) {
			case Step.FORWARD:
				return direction.getDeltaY();
			case Step.BACKWARD:
				return -direction.getDeltaY();
			case Step.STRAFE_LEFT:
				return -direction.getDeltaX();
			case Step.STRAFE_RIGHT:
				return direction.getDeltaX();
		}

		return 0;
	}

	getStep() {
		return this.step;
	}
}

Step.initialize();
Object.freeze(Step);

export { Step };
