class_name InputHandler
extends Node

signal drag(vector2: Vector2)

var pressed_position = null
var delta_position = Vector3.ZERO

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		delta_position = Vector3.ZERO
		if event.pressed:
			pressed_position = event.position
		if not event.pressed:
			pressed_position = null

	if pressed_position == null:
		return

	if event is InputEventScreenDrag:
		delta_position = event.position - pressed_position

func _process(delta: float) -> void:
	if pressed_position != null:
		if delta_position.length_squared() > 16 * 16:
			emit_signal("drag", delta_position.normalized())
