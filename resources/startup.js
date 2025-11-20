// Startup for chessboard drag and drop
window.allowDrop = function (ev) { ev.preventDefault(); }
window.drag = function (ev) { ev.dataTransfer.setData("Text", ev.target.id); }
window.drop = function (ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("Text");
    ev.target.appendChild(document.getElementById(data));
}