import store from "../store/index";
const wsUrl = "ws://localhost:3000/ws";
let ws = null;
let wsFlag = true;

let heart = {
  timeOut: 3000,
  timeObj: null,
  serverTimeObj: null,
  start: function () {
    console.log("start");

    let self = this;
    this.timeObj && clearTimeout(this.timeObj);
    this.serverTimeObj && clearTimeout(this.serverTimeObj);

    this.timeObj = setTimeout(function () {
      ws.send("Heart Monitor.");

      self.serverTimeObj = setTimeout(function () {
        ws.close();

        reConnect(wsUrl);
      }, self.timeOut);
    }, this.timeOut);
  }
};

function createWebSocket(url) {
  try {
    ws = new WebSocket(url);
    initWebSocket();
  } catch (e) {
    console.log("ws connect error.");
    reConnect(wsUrl);
  }
}

function initWebSocket() {
  ws.onopen = function () {
    store.commit("updateWsState", true);
    heart.start();
  };

  ws.onmessage = function (event) {
    store.commit("updateWsState", true);
    console.log(event.data);

    heart.start();
  };

  ws.onerror = function () {
    console.log("ws error.");
    reConnect(wsUrl);
  };

  ws.onclose = function () {
    store.commit("updateWsState", false);
    console.log("ws close.");
  };
}

//重连函数
//因为重连函数会被ws事件频繁触发，所以通过函数节流限制重连请求发送
function reConnect(url) {
  if (!wsFlag) {
    return false;
  }

  wsFlag = false;

  setTimeout(function () {
    createWebSocket(url);

    wsFlag = true;
  }, 3000);
}

createWebSocket();

export default ws;
