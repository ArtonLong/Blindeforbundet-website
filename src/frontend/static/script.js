ws = new WebSocket("");

ws.onmessage = function (event) {
    data = JSON.parse(event.data);
}