var haveEvents = "ongamepadconnected" in window;
var controllers = {};
// 连接
function connecthandler(e) {
	addgamepad(e.gamepad);
	cocoMessage.warning("正在准备" + e.gamepad.id, 2000);
	cocoMessage.success("外接控制器已连接！" + e.gamepad.index, 2000);
	console.log(controllers)
}

function addgamepad(gamepad) {
	controllers[gamepad.index] = gamepad;
	// 按键动作
	for (var i = 0; i < gamepad.buttons.length; i++) {}
	// 摇杆动作
	for (var i = 0; i < gamepad.axes.length; i++) {}
	requestAnimationFrame(updateStatus);
}

// 移除
function disconnecthandler(e) {
	removegamepad(e.gamepad);
	cocoMessage.warning("正在移除" + e.gamepad.id, 2000);
	cocoMessage.success("外接控制器已移除！", 2000);
}

function removegamepad(gamepad) {
	delete controllers[gamepad.index];
}

// 状态更新
function updateStatus() {
	if (!haveEvents) {
		scangamepads();
	}
// console.log(controllers.length)
	switch (controllers.length) {
		case 0:
			var controller = controllers[0];
			for (var i = 0; i < controller.buttons.length; i++) {
				var val = controller.buttons[i];
				if (val.pressed == true) {
					console.log(val)
				}
			};
			break;
		case 1:
			var controller2 = controllers[1];
			for (var j = 0; j < controller2.buttons.length; j++) {
				var val2 = controller2.buttons[j];
				if (val2.pressed == true) {
					console.log(val2)
				}
			};
			break;
	}

	// for (var j in controllers) {
	// 	var controller = controllers[j];
	// 	for (var i = 0; i < controller.buttons.length; i++) {
	// 		var val = controller.buttons[i];
	// 		if (val.pressed == true) {
	// 			console.log(val)
	// 		}
	// 	}
	// 	// 	cocoMessage.success("按钮输入" + controller.buttons[1], 2000);
	// 	// 	console.log(controller.buttons[i])
	// 	// 	for (i = 0; i < controller.axes.length; i++) {}
	// }

	requestAnimationFrame(updateStatus);
}

function scangamepads() {
	var gamepads = navigator.getGamepads ?
		navigator.getGamepads() :
		navigator.webkitGetGamepads ?
		navigator.webkitGetGamepads() : [];
	for (var i = 0; i < gamepads.length; i++) {
		if (gamepads[i]) {
			if (gamepads[i].index in controllers) {
				controllers[gamepads[i].index] = gamepads[i];
			} else {
				addgamepad(gamepads[i]);
			}
		}
	}
}

window.addEventListener("gamepadconnected", connecthandler);
window.addEventListener("gamepaddisconnected", disconnecthandler);

if (!haveEvents) {
	setInterval(scangamepads, 500);
}