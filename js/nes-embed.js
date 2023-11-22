//屏幕宽度
let SCREEN_WIDTH = 256;
//屏幕高度
let SCREEN_HEIGHT = 240;
let FRAMEBUFFER_SIZE = SCREEN_WIDTH * SCREEN_HEIGHT;
let canvas_ctx, image, framebuffer_u8, framebuffer_u32;
let AUDIO_BUFFERING = 512;
let SAMPLE_COUNT = 4 * 1024;
let SAMPLE_MASK = SAMPLE_COUNT - 1;
let audio_samples_L = new Float32Array(SAMPLE_COUNT);
let audio_samples_R = new Float32Array(SAMPLE_COUNT);
let audio_write_cursor = 0;
let audio_read_cursor = 0;
let nes = new nesjs.NES({
	onFrame: (framebuffer_24) => {
		let i = 0;
		for (let y = 0; y < SCREEN_HEIGHT; ++y) {
			for (let x = 0; x < SCREEN_WIDTH; ++x) {
				i = y * 256 + x;
				framebuffer_u32[i] = 0Xff000000 | framebuffer_24[i];
			}
		}
	},
	onAudioSample: (l, r) => {
		audio_samples_L[audio_write_cursor] = l;
		audio_samples_R[audio_write_cursor] = r;
		audio_write_cursor = (audio_write_cursor + 1) & SAMPLE_MASK;
	},
});

const onAnimationFrame = () => {
	window.requestAnimationFrame(onAnimationFrame);
	image.data.set(framebuffer_u8);
	canvas_ctx.putImageData(image, 0, 0);
}

const audio_remain = () => {
	return (audio_write_cursor - audio_read_cursor) & SAMPLE_MASK;
}

const audio_callback = (event) => {
	let dst = event.outputBuffer;
	let len = dst.length;
	// Attempt to avoid buffer underruns.
	if (audio_remain() < AUDIO_BUFFERING) {
		nes.frame();
	}
	let dst_l = dst.getChannelData(0);
	let dst_r = dst.getChannelData(1);
	for (let j = 0; j < len; j++) {
		let src_idx = (audio_read_cursor + j) & SAMPLE_MASK;
		dst_l[j] = audio_samples_L[src_idx];
		dst_r[j] = audio_samples_R[src_idx];
	}
	audio_read_cursor = (audio_read_cursor + len) & SAMPLE_MASK;
}
//在此配置按键
const keyboard = (callback, event) => {
	switch (event.keyCode) {
		//玩家一
		case 87: {
			// UP   --  W
			callback(1, nesjs.Controller.BUTTON_UP);
			break;
		}
		case 83: {
			// Down  --  S
			callback(1, nesjs.Controller.BUTTON_DOWN);
			break;
		}
		case 65: {
			// Left  -- A
			callback(1, nesjs.Controller.BUTTON_LEFT);
			break;
		}
		case 68: {
			// Right   -- D
			callback(1, nesjs.Controller.BUTTON_RIGHT);
			break;
		}
		case 66: {
			// B
			callback(1, nesjs.Controller.BUTTON_A);
			break;
		}
		case 86: {
			// V
			callback(1, nesjs.Controller.BUTTON_B);
			break;
		}
		case 32: {
			// 空格
			callback(1, nesjs.Controller.BUTTON_SELECT);
			break;
		}
		case 13: {
			// 回车
			callback(1, nesjs.Controller.BUTTON_START);
			break;
		}
		//玩家二
		case 38: {
			// UP   -  上
			callback(2, nesjs.Controller.BUTTON_UP);
			break;
		}
		case 40: {
			// Down  --  下
			callback(2, nesjs.Controller.BUTTON_DOWN);
			break;
		}
		case 37: {
			// Left  -- 左
			callback(2, nesjs.Controller.BUTTON_LEFT);
			break;
		}
		case 39: {
			// Right   -- 右
			callback(2, nesjs.Controller.BUTTON_RIGHT);
			break;
		}
		case 80: {
			// P
			callback(2, nesjs.Controller.BUTTON_A);
			break;
		}
		case 79: {
			// O
			callback(2, nesjs.Controller.BUTTON_B);
			break;
		}
		case 189: {
			// -
			callback(2, nesjs.Controller.BUTTON_SELECT);
			break;
		}
		case 187: {
			// =
			callback(2, nesjs.Controller.BUTTON_START);
			break;
		}
		default: {
			break;
		}
	}
}
// 配置画布
const nes_init = () => {
	const canvas = document.getElementById('nes-canvas');
	//禁止双击缩放
	canvas.addEventListener('dblclick', (e) => {
		e.preventDefault()
	}, {
		passive: false
	})
	canvas_ctx = canvas.getContext("2d", {
		alpha: false,
		colorSpace: "display-p3",
		desynchronized: true,
		wwillRedFrequently: true,
	});
	image = canvas_ctx.getImageData(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	canvas_ctx.fillStyle = "black";
	canvas_ctx.imageSmoothingEnabled = false;
	canvas_ctx.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	// Allocate framebuffer array.
	let buffer = new ArrayBuffer(image.data.length);
	framebuffer_u8 = new Uint8ClampedArray(buffer);
	framebuffer_u32 = new Uint32Array(buffer);
	//Set alpha
	for (let i = 0; i < framebuffer_u32.length; ++i) {
		framebuffer_u32[i] = 0xff000000;
	}
	// Setup audio.
	let contextClass = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window
		.oAudioContext || window.msAudioContext);
	let audio_ctx = new contextClass();
	let script_processor = audio_ctx.createScriptProcessor(AUDIO_BUFFERING, 0, 2);
	script_processor.onaudioprocess = audio_callback;
	script_processor.connect(audio_ctx.destination);
}

const nes_boot = (rom_data) => {
	nes.loadROM(rom_data);
	window.requestAnimationFrame(onAnimationFrame);
}

const nes_load_data = (rom_data) => {
	nes_init();
	nes_boot(rom_data);
}
window.addEventListener('keydown', (event) => {
	keyboard(nes.buttonDown, event)
});
//'keyup'用来取消动作  对于AB键，没有他则无法进行下一轮操作  对于方向键，没有他则游戏角色会一直朝一个方向走下去
window.addEventListener('keyup', (event) => {
	keyboard(nes.buttonUp, event)
});