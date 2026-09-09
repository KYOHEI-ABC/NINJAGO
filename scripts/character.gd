class_name Character
extends Node3D

var arms: Array[Node3D] = []
var legs: Array[Node3D] = []

var prev_position: Vector3 = Vector3.ZERO

var attack_count: int = -1

var characters: Array[Character] = []

var velocity: Vector3 = Vector3.ZERO

func _init(index: int, characters: Array[Character]) -> void:
	add_child(Main.MODELS[0].instantiate())

	arms = [get_child(0).get_node("Waist/Right Arm2"), get_child(0).get_node("Waist/Left Arm2")]
	legs = [get_child(0).get_node("Right Leg2"), get_child(0).get_node("Left Leg2")]

	self.characters = characters


func _process(delta: float) -> void:
	if attack_count >= 0:
		arms[0].rotation_degrees.x = lerp(180, 0, float(attack_count) / 15.0)
		arms[0].rotation_degrees.z = lerp(45, -45, float(attack_count) / 15.0)

		if attack_count == 8:
			for character in characters:
				if character != self and character.position.distance_to(position) < 3:
					# character.position += (character.position - position).normalized()
					character.velocity += (character.position - position).normalized() * 0.05
					character.velocity.y += 0.05


	else:
		idle()


	if (prev_position - position).length_squared() > 0.0001:
		walk()
		if randf() < 0.005:
			if position.y == 0:
				velocity.y += 0.5

	prev_position = position

	if attack_count >= 0:
		attack_count += 1
		if attack_count > 15:
			attack_count = -1

	position += velocity
	velocity = velocity * 0.9

	if position.y > 0:
		velocity.y -= 0.03
	else:
		position.y = 0
		velocity.y = 0
	print(position.y)

func idle() -> void:
	all_rotation_x(0)
	arms[0].rotation_degrees.z = 0

func all_rotation_x(x_degrees: float) -> void:
	arms[0].rotation_degrees.x = x_degrees
	arms[1].rotation_degrees.x = - x_degrees
	legs[0].rotation_degrees.x = - x_degrees
	legs[1].rotation_degrees.x = x_degrees

func walk() -> void:
	var progress = sin(PI * Time.get_ticks_msec() / 300.0)
	all_rotation_x(45 * progress)


func attack() -> void:
	if attack_count == -1:
		attack_count = 0
		arms[0].rotation_degrees.x = 180
		arms[0].rotation_degrees.z = 45
