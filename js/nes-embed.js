var SCREEN_WIDTH = 256;
var SCREEN_HEIGHT = 240;
var FRAMEBUFFER_SIZE = SCREEN_WIDTH * SCREEN_HEIGHT;

var canvas_ctx, image;
var framebuffer_u8, framebuffer_u32;

var AUDIO_BUFFERING = 512;
var SAMPLE_COUNT = 4 * 1024;
var SAMPLE_MASK = SAMPLE_COUNT - 1;
var audio_samples_L = new Float32Array(SAMPLE_COUNT);
var audio_samples_R = new Float32Array(SAMPLE_COUNT);
var audio_write_cursor = 0,
	audio_read_cursor = 0;

var nes = new jsnes.NES({
	onFrame: function(framebuffer_24) {
		for (var i = 0; i < FRAMEBUFFER_SIZE; i++) framebuffer_u32[i] = 0xFF000000 | framebuffer_24[i];
	},
	onAudioSample: function(l, r) {
		audio_samples_L[audio_write_cursor] = l;
		audio_samples_R[audio_write_cursor] = r;
		audio_write_cursor = (audio_write_cursor + 1) & SAMPLE_MASK;
	},
});

function onAnimationFrame() {
	window.requestAnimationFrame(onAnimationFrame);

	image.data.set(framebuffer_u8);
	canvas_ctx.putImageData(image, 0, 0);
}

function audio_remain() {
	return (audio_write_cursor - audio_read_cursor) & SAMPLE_MASK;
}

function audio_callback(event) {
	var dst = event.outputBuffer;
	var len = dst.length;

	// Attempt to avoid buffer underruns.
	if (audio_remain() < AUDIO_BUFFERING) nes.frame();

	var dst_l = dst.getChannelData(0);
	var dst_r = dst.getChannelData(1);
	for (var i = 0; i < len; i++) {
		var src_idx = (audio_read_cursor + i) & SAMPLE_MASK;
		dst_l[i] = audio_samples_L[src_idx];
		dst_r[i] = audio_samples_R[src_idx];
	}

	audio_read_cursor = (audio_read_cursor + len) & SAMPLE_MASK;
}

//在此配置按键
function keyboard(callback, event) {
	var player = 1;
	switch (event.keyCode) {
		case 87: // UP   -  W
			callback(player, jsnes.Controller.BUTTON_UP);
			break;
		case 83: // Down  --  S
			callback(player, jsnes.Controller.BUTTON_DOWN);
			break;
		case 65: // Left  -- A
			callback(player, jsnes.Controller.BUTTON_LEFT);
			break;
		case 68: // Right   -- D
			callback(player, jsnes.Controller.BUTTON_RIGHT);
			break;
		case 75: // K
			callback(player, jsnes.Controller.BUTTON_A);
			break;
		case 74: // J
			callback(player, jsnes.Controller.BUTTON_B);
			break;
		case 32: // 空格
			callback(player, jsnes.Controller.BUTTON_SELECT);
			break;
		case 13: // 回车
			callback(player, jsnes.Controller.BUTTON_START);
			break;
		default:
			break;
	}
}

function nes_init(canvas_id) {
	var canvas = document.getElementById(canvas_id);
	//禁止双击缩放
	canvas.addEventListener('dblclick',function(e){
		e.preventDefault()
	})
	canvas_ctx = canvas.getContext("2d");
	image = canvas_ctx.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

	canvas_ctx.fillStyle = "black";
	canvas_ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);

	// Allocate framebuffer array.
	var buffer = new ArrayBuffer(image.data.length);
	framebuffer_u8 = new Uint8ClampedArray(buffer);
	framebuffer_u32 = new Uint32Array(buffer);

	// Setup audio.
	var contextClass = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window
		.oAudioContext || window.msAudioContext);
	var audio_ctx = new contextClass();
	// var audio_ctx = new window.AudioContext();
	var script_processor = audio_ctx.createScriptProcessor(AUDIO_BUFFERING, 0, 2);
	script_processor.onaudioprocess = audio_callback;
	script_processor.connect(audio_ctx.destination);
}

function nes_boot(rom_data) {
	nes.loadROM(rom_data);
	window.requestAnimationFrame(onAnimationFrame);
}

function nes_load_data(canvas_id, rom_data) {
	nes_init(canvas_id);
	nes_boot(rom_data);
}

//入口函数，调用它加载游戏
function nes_load_url(canvas_id, path) {
	nes_init(canvas_id);

	var req = new XMLHttpRequest();
	req.open("GET", path);
	req.overrideMimeType("text/plain; charset=x-user-defined");
	req.onerror = () => console.log(`Error loading ${path}: ${req.statusText}`);

	req.onload = function() {
		if (this.status === 200) {
			//装载游戏数据
			nes_boot(this.responseText);
		} else if (this.status === 0) {
			// Aborted, so ignore error
		} else {
			req.onerror();
		}
	};

	req.send();
}

document.addEventListener('keydown', (event) => {
	keyboard(nes.buttonDown, event)
});
//'keyup'用来取消动作  对于AB键，没有他则无法进行下一轮操作  对于方向键，没有他则游戏角色会一直朝一个方向走下去
document.addEventListener('keyup', (event) => {
	keyboard(nes.buttonUp, event)
});
