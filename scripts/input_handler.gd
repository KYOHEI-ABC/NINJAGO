class_name InputHandler
extends Node

signal pressed(position: Vector2)
signal drag(vector2: Vector2)

var pressed_position = null
var current_position = null

var valid_area: Rect2 = Rect2(Vector2(-1000, -1000), Vector2(4000, 4000))
var index: int = -1

var pressed_time: float = 0.0

func _input(event: InputEvent) -> void:
	if event is InputEventScreenTouch:
		if event.pressed:
			if valid_area.has_point(event.position):
				pressed_position = event.position
				current_position = event.position
				index = event.index
				pressed_time = Time.get_ticks_msec() / 1000.0
		if not event.pressed:
			if index == event.index:
				pressed_position = null
				current_position = null
				index = -1
				var released_time = Time.get_ticks_msec() / 1000.0
				if released_time - pressed_time < 0.2:
					emit_signal("pressed", event.position)


	if event is InputEventScreenDrag:
		if index == event.index:
			current_position = event.position

func _process(delta: float) -> void:
	if index != -1:
		var delta_position = current_position - pressed_position
		if delta_position.length_squared() > 32 * 32:
			emit_signal("drag", delta_position.normalized())
