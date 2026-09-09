class_name InputHandler
extends Node

signal drag(vector2: Vector2)

var pressed_position = null

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			pressed_position = event.position
		if not event.pressed:
			pressed_position = null

	if pressed_position == null:
		return

	if event is InputEventScreenDrag:
		if (event.position - pressed_position).length_squared() > 32 * 32:
			emit_signal("drag", (event.position - pressed_position).normalized())
