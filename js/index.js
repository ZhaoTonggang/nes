// 加载
var vm = new Vue({
	el: "#app",
	data: {
		game_list: []
	},
	created() {
		//获取游戏列表
		this.getGameList()
	},
	methods: {
		startGame(id) {
			window.open('./game.html?=' + id, '_self')
		},
		getGameList: async function() {
			try {
				var result = await axios.get('./game_list.json')
				this.game_list = result.data
			} catch (err) {
				console.log(err)
			}
		}
	}
})

//网站标题自动判断
var title = document.title;

function istitle() {
	var isHidden = document.hidden;
	if (isHidden) {
		//当窗口不可见
		document.title = '(つ ェ ⊂)我藏好了哦~';
	} else {
		//当窗口可见
		document.title = '(*゜ロ゜)ノ被发现了~';
		setTimeout("document.title=title", 3000);
	}
};
document.addEventListener('visibilitychange', istitle);

//密钥
sessionStorage.setItem("nesHeheda", "1")
