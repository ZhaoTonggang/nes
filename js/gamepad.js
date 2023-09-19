// 连接
window.addEventListener("gamepadconnected", function(e) {
	// e.gamepad.buttons.length,
	// e.gamepad.axes.length,
	// e.gamepad.index,
	cocoMessage.warning("正在准备"+e.gamepad.id, 2000);
	cocoMessage.success("外接控制器已连接！", 2000);
	alert("十分抱歉，目前外接控制器的相关功能正在测试中，暂不开放使用，敬请留意后续。");
});
// 断开
window.addEventListener("gamepaddisconnected", function(e) {
	cocoMessage.warning("正在移除"+e.gamepad.id, 2000);
	cocoMessage.success("外接控制器已移除！", 2000);
});