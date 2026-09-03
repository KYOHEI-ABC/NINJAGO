[...Outliner.root].forEach(element => element.remove());

const newCube = (name, from, size, inflate = 0) => new Cube({
	name,
	from,
	to: from.map((v, i) => v + size[i]),
	origin: from.map((v, i) => v + size[i] / 2),
	inflate
}).init();

function newGroup(name, from, size) {
	const cube = newCube(name, from, size);
	const group = new Group({
		name,
		origin: [...cube.origin]
	}).init();
	cube.addTo(group);
	return group;
}


const rightLeg = newGroup("RightLeg", [0.5, 0, -3], [5.5, 12, 6]);
rightLeg.origin[1] = rightLeg.children[0].to[1]
// rightLeg.origin[1] = rightLeg.children[0].to[1] - (rightLeg.children[0].to[0] - rightLeg.children[0].from[0]) / 2
const leftLeg = newGroup("LeftLeg", [-6, 0, -3], [5.5, 12, 6]);
leftLeg.origin[1] = leftLeg.children[0].to[1]
// leftLeg.origin[1] = leftLeg.children[0].to[1] - (leftLeg.children[0].to[0] - leftLeg.children[0].from[0]) / 2

const body = newGroup("Body", [-6, 12, -3], [12, 12, 6]);
newCube("Hip", [-0.5, 6, -3], [1, 6, 6]).addTo(body);
// newCube("Joint", [-5.5, 12 - 4.5, -4.5 / 2], [11, 4.5, 4.5]).addTo(body);
// newCube("Shoulder", [-7, 24 - 1 - 3.5, -3.5 / 2], [14, 3.5, 3.5]).addTo(body);

const head = newGroup("Head", [-4, 25, -4], [8, 8, 8]);
newCube("Neck", [-2, 24, -2], [4, 1, 4]).addTo(head);
newCube("Stud", [-2, 33, -2], [4, 1, 4]).addTo(head);

const rightArm = newGroup("RightArm", [6 - 1.5, 14, -1.5], [3, 8, 3]);
rightArm.origin[1] = rightArm.children[0].to[1]
// rightArm.origin[1] = rightArm.children[0].to[1] - (rightArm.children[0].to[0] - rightArm.children[0].from[0]) / 2

newGroup("RightHand", [rightArm.origin[0] - 2, rightArm.children[0].from[1] - 4, -2], [4, 4, 4]).addTo(rightArm);

const leftArm = newGroup("LeftArm", [-9 + 1.5, 14, -1.5], [3, 8, 3]);
leftArm.origin[1] = leftArm.children[0].to[1]
// leftArm.origin[1] = leftArm.children[0].to[1] - (leftArm.children[0].to[0] - leftArm.children[0].from[0]) / 2
newGroup("LeftHand", [leftArm.origin[0] - 2, leftArm.children[0].from[1] - 4, -2], [4, 4, 4]).addTo(leftArm);

// rightLeg.rotation[1] = -1.5
// leftLeg.rotation[1] = 1.5

// rightArm.rotation[2] = 15
// leftArm.rotation[2] = -15

function verifyGroup(index, name, origin, length) {
	const g = Group.all[index];
	if (!g) return console.assert(), false;
	if (g.name !== name) return console.assert(), false;
	if (JSON.stringify(g.origin) !== JSON.stringify(origin)) return console.assert(), false;
	if (g.children.length !== length) return console.assert(), false;
	if (g.children[0].name !== g.name) return console.assert(), false;

	return true;
};

verifyGroup(0, "RightLeg", [(0.5 + 6) / 2, 12, 0], 1);
verifyGroup(1, "LeftLeg", [(-6 - 0.5) / 2, 12, 0], 1);
verifyGroup(2, "Body", [0, 18, 0], 2);
console.assert(Group.all[2].children[1].name == "Hip");

verifyGroup(3, "Head", [0, 29, 0], 3);
console.assert(Group.all[3].children[1].name == "Neck");
console.assert(Group.all[3].children[2].name == "Stud");

verifyGroup(4, "RightArm", [6 + 1.5 - 1, 24 - 1.5 - 1, 0], 2);
console.assert(Group.all[4].children[1].name == "RightHand");

verifyGroup(5, "RightHand", [6 + 1.5 - 1, 12 + 2 - 1, 0], 1);

verifyGroup(6, "LeftArm", [-6 - 1.5 + 1, 24 - 1.5 - 1, 0], 2);
console.assert(Group.all[6].children[1].name == "LeftHand");

verifyGroup(7, "LeftHand", [-6 - 1.5 + 1, 12 + 2 - 1, 0], 1);

Group.all.forEach(group => {
	console.assert(group.origin[2] == 0)
});

function size(cube) {
	return [cube.to[0] - cube.from[0], cube.to[1] - cube.from[1], cube.to[2] - cube.from[2]];
}

function verifyCube(index, name, expectedSize, origin) {
	const c = Cube.all[index];
	if (!c) return console.assert(), false;
	if (c.name !== name) return console.assert(), false;
	if (JSON.stringify(size(c)) !== JSON.stringify(expectedSize)) return console.assert(), false;
	if (JSON.stringify(c.origin) !== JSON.stringify(origin)) return console.assert(), false;
	if (c.parent.name !== name) console.log(c.parent.name, name);

	return true;
}


verifyCube(0, "RightLeg", [5.5, 12, 6], [(0.5 + 6) / 2, 6, 0]);
verifyCube(1, "LeftLeg", [5.5, 12, 6], [(-6 - 0.5) / 2, 6, 0]);
verifyCube(2, "Body", [12, 12, 6], [0, 18, 0]);
verifyCube(3, "Hip", [1, 6, 6], [0, 9, 0]);
verifyCube(4, "Head", [8, 8, 8], [0, 29, 0]);
verifyCube(5, "Neck", [4, 1, 4], [0, 24.5, 0]);
verifyCube(6, "Stud", [4, 1, 4], [0, 33.5, 0]);

verifyCube(7, "RightArm", [3, 8, 3], [6 + 1.5 - 1, 20 - 1, 0]);
verifyCube(8, "RightHand", [4, 4, 4], [6 + 1.5 - 1, 14 - 1, 0]);
verifyCube(9, "LeftArm", [3, 8, 3], [-6 - 1.5 + 1, 20 - 1, 0]);
verifyCube(10, "LeftHand", [4, 4, 4], [-6 - 1.5 + 1, 14 - 1, 0]);


const RightLeg = Cube.all[0];
const LeftLeg = Cube.all[1];
const Body = Cube.all[2];
const Hip = Cube.all[3];
const Head = Cube.all[4];
const Neck = Cube.all[5];
const Stud = Cube.all[6];
const RightArm = Cube.all[7];
const RightHand = Cube.all[8];
const LeftArm = Cube.all[9];
const LeftHand = Cube.all[10];

const RightLegGroup = Group.all[0];
const LeftLegGroup = Group.all[1];
const BodyGroup = Group.all[2];
const HeadGroup = Group.all[3];
const RightArmGroup = Group.all[4];
const RightHandGroup = Group.all[5];
const LeftArmGroup = Group.all[6];
const LeftHandGroup = Group.all[7];


console.assert(RightLeg.from[0] == Hip.to[0]);
console.assert(LeftLeg.to[0] == Hip.from[0]);
console.assert(RightLeg.to[1] == Body.from[1]);
console.assert(LeftLeg.to[1] == Body.from[1]);
console.assert(Body.to[1] == Neck.from[1]);
console.assert(Neck.to[1] == Head.from[1]);
console.assert(Head.to[1] == Stud.from[1]);
console.assert(Stud.to[1] == 12 + 12 + 1 + 8 + 1);

console.assert(Hip.to[1] == Body.from[1]);
console.assert(Hip.from[1] == RightLeg.to[1] / 2);
console.assert(Hip.from[1] == LeftLeg.to[1] / 2);

console.assert(Body.to[0] - 1 == RightArm.from[0]);
console.assert(Body.to[1] - 1 == RightArm.to[1]);

console.assert(RightArm.from[1] == RightHand.to[1]);
console.assert(RightArm.from[0] - 0.5 == RightHand.from[0]);
console.assert(RightArm.to[0] + 0.5 == RightHand.to[0]);
console.assert(RightArm.origin[0] == RightHand.origin[0]);

console.assert(Body.from[0] + 1 == LeftArm.to[0]);
console.assert(Body.to[1] - 1 == LeftArm.to[1]);

console.assert(LeftArm.from[1] == LeftHand.to[1]);
console.assert(LeftArm.from[0] - 0.5 == LeftHand.from[0]);
console.assert(LeftArm.to[0] + 0.5 == LeftHand.to[0]);
console.assert(LeftArm.origin[0] == LeftHand.origin[0]);

console.assert(RightLeg.origin[1] == LeftLeg.origin[1]);
console.assert(RightArm.origin[1] == LeftArm.origin[1]);
console.assert(RightHand.origin[1] == LeftHand.origin[1]);

console.assert(RightArmGroup.origin[0] + 1.5 == RightArm.to[0]);
console.assert(LeftArmGroup.origin[0] + 1.5 == LeftArm.to[0]);
console.assert(RightArmGroup.origin[0] - 1.5 == RightArm.from[0]);
console.assert(LeftArmGroup.origin[0] - 1.5 == LeftArm.from[0]);

console.assert(RightArmGroup.origin[1] + 1.5 == RightArm.to[1]);
console.assert(LeftArmGroup.origin[1] + 1.5 == LeftArm.to[1]);
console.assert(RightArmGroup.origin[1] == LeftArmGroup.origin[1]);

console.assert(RightArmGroup.origin[0] == RightHandGroup.origin[0]);
console.assert(LeftArmGroup.origin[0] == LeftHandGroup.origin[0]);

console.assert(RightLegGroup.origin[0] + 5.5 / 2 == RightLeg.to[0]);
console.assert(RightLegGroup.origin[0] - 5.5 / 2 == RightLeg.from[0]);
console.assert(RightLegGroup.origin[1] == RightLeg.to[1]);

console.assert(LeftLegGroup.origin[0] + 5.5 / 2 == LeftLeg.to[0]);
console.assert(LeftLegGroup.origin[0] - 5.5 / 2 == LeftLeg.from[0]);
console.assert(LeftLegGroup.origin[1] == LeftLeg.to[1]);

console.assert(RightLegGroup.origin[1] == LeftLegGroup.origin[1]);


const ModelGroup = new Group({ name: "Model" }).init();
RightLegGroup.addTo(ModelGroup);
LeftLegGroup.addTo(ModelGroup);
BodyGroup.addTo(ModelGroup);
HeadGroup.addTo(ModelGroup);
RightArmGroup.addTo(ModelGroup);
LeftArmGroup.addTo(ModelGroup);

Cube.all.forEach(cube => {
	console.log(cube.name);
	console.assert(cube.origin[2] == 0);
});


Animation.all.slice().forEach(anim => anim.remove());

const anim = new Animation({
	name: 'walk',
	loop: 'loop',
	length: 1.0
}).add();

const animData = [
	{ group: RightLegGroup, channel: 'rotation', keys: [[0, 30], [0.5, -30], [1, 30]] },
	{ group: LeftLegGroup, channel: 'rotation', keys: [[0, -30], [0.5, 30], [1, -30]] },
	{ group: RightArmGroup, channel: 'rotation', keys: [[0, -30], [0.5, 30], [1, -30]] },
	{ group: LeftArmGroup, channel: 'rotation', keys: [[0, 30], [0.5, -30], [1, 30]] },

	{
		group: ModelGroup,
		channel: 'position',
		keys: [
			[0, -0.5],
			[0.25, 0],
			[0.5, -0.5],
			[0.75, 0],
			[1, -0.5]
		]
	}
];

animData.forEach(({ group, channel, keys }) => {
	const animator = anim.getBoneAnimator(group);

	keys.forEach(([time, value]) => {
		const point = channel === 'position'
			? { x: 0, y: value, z: 0 }
			: { x: value, y: 0, z: 0 };

		animator.addKeyframe({
			channel: channel,
			time: time,
			data_points: [point]
		});
	});
});


// NINJAGO
// Cube.all.find(cube => cube.name === 'Neck').visibility = false;
// Cube.all.find(cube => cube.name === 'Stud').visibility = false;

// newCube("Mask", [-11 / 2, 24.5, -11 / 2], [11, 10.5, 11]).addTo(head);
// newCube("Mask", [-4, 24, -4], [8, 0.5, 8]).addTo(head);
// newCube("Mask", [-4, 24 + 0.5 + 10.5, -4], [8, 0.5, 8]).addTo(head);

// Cube.all.find(cube => cube.name === 'Head').inflate = 0.5;
// Cube.all.find(cube => cube.name === 'Head').from = [-3.5, 25.5, -3.5]
// Cube.all.find(cube => cube.name === 'Head').to = [3.5, 32.5, 3.5]

// newCube("Mask", [-5, 24, -5], [10, 10, 10]).addTo(head);
// newCube("Mask", [-4, 25, -4], [8, 8, 8], 1).addTo(head);
// newCube("Mask", [-4, 25, -4], [8, 8, 8], 1.5).addTo(head);



Canvas.updateAll();
