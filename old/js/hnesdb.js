// 格式化时间
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1,
		"d+": this.getDate(),
		"h+": this.getHours(),
		"m+": this.getMinutes(),
		"s+": this.getSeconds(),
		"q+": Math.floor((this.getMonth() + 3) / 3),
		"S": this.getMilliseconds()
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((
			"00" + o[k]).substr(("" + o[k]).length)));
	return fmt
};
// 创建indexedDB
class hehedaDB {
	constructor() {
		this.DBName = "HnesDB";
		this.DBStore = "HnesDBs";
		this.DB = {};
		this.cIndex = "HEHEDA";
	}
	initDB() {
		let that = this;
		let indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
		let request = indexedDB.open(that.DBName);
		return new Promise(function(resovle, reject) {
			request.onerror = function(e) {
				console.log('open Error!');
				resovle();
			};
			request.onsuccess = function(e) {
				that.DB = e.target.result;
				resovle();
			};
			request.onupgradeneeded = function(e) {
				let db = e.target.result;
				if (!db.objectStoreNames.contains(that.DBStore)) {
					try {
						let store = db.createObjectStore(that.DBStore, {
							keyPath: 'id',
							autoIncrement: true
						});
						store.createIndex(that.cIndex, 'code', {
							unique: false
						})
					} catch (e) {
						console.log(e)
					}
				}
			}
		}).catch(error => {
			console.log('Error！');
		});
	}
	setData(data) {
		let that = this;
		return new Promise(function(resovle, reject) {
			let request = that.DB.transaction(that.DBStore, 'readwrite')
				.objectStore(that.DBStore)
				.put(data);
			request.onsuccess = function(event) {
				resovle(event.target.result);
			};
			request.onerror = function(event) {
				console.log('Error！');
			}
		});
	}
	getDataListByCode(code) {
		let that = this;
		return new Promise(function(resovle, reject) {
			let request = that.DB
				.transaction(that.DBStore)
				.objectStore(that.DBStore)
				.index(that.cIndex)
				.openCursor(IDBKeyRange.only(code));
			let dataList = [];
			request.onsuccess = function(event) {
				let cursor = event.target.result;
				let isEnd = true;
				if (cursor) {
					let cursorVal = cursor.value;
					let info = new Object();
					info.id = cursorVal.id;
					info.code = cursorVal.code;
					info.pic = cursorVal.pic;
					info.time = cursorVal.time;
					dataList.push(info);
					isEnd = false;
					cursor.continue()
				}
				if (isEnd) {
					resovle(dataList);
				}
			}

			request.onerror = function(event) {
				console.log('Error！');
			}
		});
	}
	getData(id) {
		let that = this;
		return new Promise(function(resovle, reject) {
			let request = that.DB.transaction(that.DBStore, 'readwrite')
				.objectStore(that.DBStore)
				.get(id);
			request.onsuccess = function(event) {
				resovle(event.target.result.data);
			};
			request.onerror = function(event) {
				console.log('Error！');
			}
		});
	}
	delData(id) {
		let that = this;
		return new Promise(function(resovle, reject) {
			let request = that.DB
				.transaction(that.DBStore, "readwrite")
				.objectStore(that.DBStore)
				.delete(id);
			request.onsuccess = function(event) {
				resovle(event.target.result);
			};
			request.onerror = function(event) {
				console.log("数据删除失败");
			}
		});
	}
}
let HDB = new hehedaDB();
let sbts = true;
// 存取操作
function nessave(type, code, dom, id) {
	let canvas = document.getElementById("nes-canvas");
	let nesInfo = new Object();
	nesInfo.code = code.toString();
	//获取图片
	nesInfo.pic = canvas.toDataURL("image/jpeg", 1);
	// 获取日期
	nesInfo.time = new Date().Format("yyyy年MM月dd日 hh:mm:ss");
	//获取进度
	nesInfo.data = nes.toJSON();
	if (typeof id != "undefined") {
		nesInfo.id = id;
	}
	HDB.initDB().then(() => {
		let hnbut = document.getElementById("hnbut");
		let hnul = document.getElementById("hnul");
		if (type == "a") {
			HDB.setData(nesInfo).then(() => {
				sbts = true;
				hnul.style.display = "none";
				cocoMessage.success("保存成功！", 2000);
			});
		} else if (type == "b") {
			HDB.getData(id).then((d) => {
				nes.fromJSON(d);
				sbts = true;
				hnul.style.display = "none";
				cocoMessage.success("读取成功！", 2000);
			});
		} else {
			HDB.delData(id).then(() => {
				sbts = true;
				hnul.style.display = "none";
				cocoMessage.success("删除成功！", 2000);
			})
		}
	})
}