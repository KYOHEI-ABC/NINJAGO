class_name Main
extends Node

static var WINDOW: Vector2 = Vector2(ProjectSettings.get_setting("display/window/size/viewport_width"), ProjectSettings.get_setting("display/window/size/viewport_height"))

const MODELS: Array[PackedScene] = [
	preload("res://assets/steve/steve.gltf"),
]

var characters: Array[Character] = []

var input_handler: InputHandler = InputHandler.new()

func _ready() -> void:
	var camera = Camera3D.new()
	camera.position = Vector3(0.0, 32.0, 32.0)
	camera.rotation_degrees.x = -45
	camera.fov = 15.0
	add_child(camera)

	var light = DirectionalLight3D.new()
	light.position = Vector3(0.0, 32.0, 0.0)
	light.rotation_degrees = Vector3(-30.0, 30, 0)
	light.shadow_enabled = true
	add_child(light)

	var mesh_instance = MeshInstance3D.new()
	add_child(mesh_instance)
	mesh_instance.mesh = PlaneMesh.new()
	mesh_instance.mesh.size = Vector2(64, 64)
	mesh_instance.material_override = StandardMaterial3D.new()
	mesh_instance.material_override.albedo_texture = load("res://assets/grass_carried.png")
	mesh_instance.material_override.uv1_scale = Vector3(64, 64, 1)
	mesh_instance.material_override.texture_filter = BaseMaterial3D.TEXTURE_FILTER_NEAREST


	add_child(input_handler)

	characters.append(Character.new(0))
	add_child(characters[0])

	input_handler.drag.connect(func(drag: Vector2) -> void:
		var move_dir = Vector3(drag.x, 0, drag.y)
		if move_dir == Vector3.ZERO:
			return
		var target = characters[0]
		target.position += move_dir * 0.1
		target.look_at(target.position + move_dir, Vector3.UP)
	)
