class_name Main
extends Node

static var WINDOW: Vector2 = Vector2(ProjectSettings.get_setting("display/window/size/viewport_width"), ProjectSettings.get_setting("display/window/size/viewport_height"))

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

	var mI = MeshInstance3D.new()
	mI.position.y = 0.5
	mI.mesh = SphereMesh.new()
	add_child(mI)

	add_child(input_handler)
	input_handler.drag.connect(func(vector2: Vector2) -> void:
		print(vector2)
	)
