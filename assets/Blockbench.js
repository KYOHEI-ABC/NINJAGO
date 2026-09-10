[...Outliner.root].forEach(element => element.remove());

const newCube = (name, from, size, inflate = 0) => new Cube({
	name,
	from,
	to: from.map((v, i) => v + size[i]),
	origin: from.map((v, i) => v + size[i] / 2),
	inflate,
	box_uv: true
}).init();

function newGroup(name, from, size) {
	const cube = newCube(name, from, size);
	const group = new Group({
		name,
		origin: [...cube.origin]
	}).init();
	cube.addTo(group);
	newCube(name + 'Layer', from, size, 0.25).addTo(group);
	return group;
}

const head = newGroup("Head", [-4, 24, -4], [8, 8, 8]);
head.origin[1] = head.children[0].from[1];

const body = newGroup("Body", [-4, 12, -2], [8, 12, 4]);

const rightArm = newGroup("RightArm", [4, 12, -2], [3, 12, 4]);
rightArm.origin[0] = rightArm.children[0].from[0] + 1;
rightArm.origin[1] = rightArm.children[0].to[1] - 2;

const leftArm = newGroup("LeftArm", [-7, 12, -2], [3, 12, 4]);
leftArm.origin[0] = leftArm.children[0].to[0] - 1;
leftArm.origin[1] = leftArm.children[0].to[1] - 2;

const rightLeg = newGroup("RightLeg", [0, 0, -2], [4, 12, 4]);
rightLeg.origin[1] = rightLeg.children[0].to[1];
const leftLeg = newGroup("LeftLeg", [-4, 0, -2], [4, 12, 4]);
leftLeg.origin[1] = leftLeg.children[0].to[1];

head.children[0].uv_offset = [0, 0]
head.children[1].uv_offset = [32, 0]

body.children[0].uv_offset = [16, 16]
body.children[1].uv_offset = [16, 32]

rightArm.children[0].uv_offset = [40, 16]
rightArm.children[1].uv_offset = [40, 32]

leftArm.children[0].uv_offset = [32, 48]
leftArm.children[1].uv_offset = [48, 48]

rightLeg.children[0].uv_offset = [0, 16]
rightLeg.children[1].uv_offset = [0, 32]

leftLeg.children[0].uv_offset = [16, 48]
leftLeg.children[1].uv_offset = [0, 48]

if (Texture.all[0]) {
	Cube.all.forEach(cube => {
		for (let f in cube.faces) {
			cube.faces[f].texture = Texture.all[0].uuid;
		}
	});
}

Canvas.updateAll();