class_name Character
extends Node3D

var index: int = -1

var arms: Array[Node3D] = []
var legs: Array[Node3D] = []

var prev_position: Vector3 = Vector3.ZERO

var attack_count: int = -1

var characters: Array[Character] = []


func _init(index: int, characters: Array[Character]) -> void:
	self.index = index
	add_child(Main.MODELS[index].instantiate())

	if index > 1:
		return

	arms = [get_child(0).get_node("Waist/Right Arm2"), get_child(0).get_node("Waist/Left Arm2")]
	legs = [get_child(0).get_node("Right Leg2"), get_child(0).get_node("Left Leg2")]

	self.characters = characters


func _process(delta: float) -> void:
	if index > 1:
		return
	if attack_count >= 0:
		arms[0].rotation_degrees.x = lerp(180, 0, float(attack_count) / 15.0)
		arms[0].rotation_degrees.z = lerp(45, -45, float(attack_count) / 15.0)

		if attack_count == 8:
			for character in characters:
				if character != self and character.position.distance_to(position) < 2:
					character.position += (character.position - position).normalized()
					character.look_at_from_position(character.position, position, Vector3.UP)


	else:
		idle()


	if prev_position != position:
		walk()

	prev_position = position

	if attack_count >= 0:
		attack_count += 1
		if attack_count > 15:
			attack_count = -1


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
		all_rotation_x(90)
		attack_count = 0
		arms[0].rotation_degrees.x = 180
		arms[0].rotation_degrees.z = 45
