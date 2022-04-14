import store from "../store/index";
const url = "ws://localhost:3000/ws";
let wsTimer = null;

const ws = new WebSocket(url);

ws.onopen = () => {
  store.commit("updateWsState", true);
  ws.send("Connection success.");
};

ws.onmessage = (msg) => {
  console.log(msg);
};

ws.onclose = (event) => {
  store.commit("updateWsState", false);

  console.log(event);
};

ws.onerror = (error) => {
  store.commit("updateWsState", false);
  console.log(error);
};

export default ws;
