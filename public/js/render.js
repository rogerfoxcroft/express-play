function refreshFileViewer() {
    $.get('/documents', null, renderNodes, 'json')
}

function renderNodes(arr) {
    for (i = 0; i < arr.length; i++) {
        renderNode(arr[i]);
    }
}

function renderNode(node) {
    var canvas = document.getElementById('main-viewer');
    var context = canvas.getContext("2d");
    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = 5;

    context.beginPath();
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    context.fillStyle = 'green';
    context.fill();
}
