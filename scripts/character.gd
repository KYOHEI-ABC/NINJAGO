class_name Character
extends Node3D

var arms: Array[Node3D] = []
var legs: Array[Node3D] = []

var prev_position: Vector3 = Vector3.ZERO

func _init(index: int) -> void:
	add_child(Main.MODELS[0].instantiate())

	arms = [get_child(0).get_node("Waist/Right Arm2"), get_child(0).get_node("Waist/Left Arm2")]
	legs = [get_child(0).get_node("Right Leg2"), get_child(0).get_node("Left Leg2")]

func _process(delta: float) -> void:
	if prev_position == position:
		idle()
	else:
		walk()

	prev_position = position

func idle() -> void:
	all_rotation_x(0)

func all_rotation_x(x_degrees: float) -> void:
	arms[0].rotation_degrees.x = x_degrees
	arms[1].rotation_degrees.x = - x_degrees
	legs[0].rotation_degrees.x = - x_degrees
	legs[1].rotation_degrees.x = x_degrees

func walk() -> void:
	var progress = sin(PI * Time.get_ticks_msec() / 300.0)
	all_rotation_x(45 * progress)
