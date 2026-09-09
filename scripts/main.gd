class_name Main
extends Node

static var WINDOW: Vector2 = Vector2(ProjectSettings.get_setting("display/window/size/viewport_width"), ProjectSettings.get_setting("display/window/size/viewport_height"))

const MODELS: Array[PackedScene] = [
	preload("res://assets/steve/steve.gltf"),
	preload("res://assets/valorie/valorie.gltf"),
	preload("res://assets/zombie/zombie.gltf"),
	preload("res://assets/skeleton/skeleton.gltf"),
]

var characters: Array[Character] = []

var input_handlers: Array[InputHandler] = [InputHandler.new(), InputHandler.new()]

func _ready() -> void:
	var camera = Camera3D.new()
	camera.position = Vector3(0.0, 8.0, 32.0)
	camera.rotation_degrees.x = -15
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


	add_child(input_handlers[0])
	input_handlers[0].valid_area.end.x = Main.WINDOW.x / 2

	add_child(input_handlers[1])
	input_handlers[1].valid_area.position.x = Main.WINDOW.x / 2


	characters.append(Character.new(0, characters))
	add_child(characters[0])
	characters[0].position = Vector3(-1, 0, 3)
	characters[0].rotation_degrees.y = 180

	characters.append(Character.new(1, characters))
	add_child(characters[1])
	characters[1].position = Vector3(1, 0, 3)
	characters[1].rotation_degrees.y = 180

	characters.append(Character.new(2, characters))
	add_child(characters[2])
	characters[2].position = Vector3(-5, 0, -3)
	characters[2].rotation_degrees.y = 180

	characters.append(Character.new(3, characters))
	add_child(characters[3])
	characters[3].position = Vector3(5, 0, -3)
	characters[3].rotation_degrees.y = 180


	for i in range(2):
		input_handlers[i].drag.connect(func(drag: Vector2) -> void:
			var move_dir = Vector3(drag.x, 0, drag.y)
			if move_dir == Vector3.ZERO:
				return
			var target = characters[i]
			if target.attack_count >= 0:
				return
			target.position += move_dir * 0.1
			target.look_at(target.position + move_dir, Vector3.UP)
		)

		input_handlers[i].pressed.connect(func(position: Vector2) -> void:
			characters[i].attack()
		)
