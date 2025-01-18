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

	static pool = new Map();

	static initialize() {
		Step.validSteps.forEach((step) => {
			Step.pool.set(step, new Step(step));
		});
	}

	step;

	constructor(step) {
		if (!Step.validSteps.has(step)) {
			throw new Error(`Invalid step: ${step}`);
		}

		this.step = step;
	}

	getStep() {
		return this.step;
	}
}

Step.initialize();
Object.freeze(Step);

export { Step };
