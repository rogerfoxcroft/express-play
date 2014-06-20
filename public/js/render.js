function refreshFileViewer() {
    $('#main-viewer').empty();
    $.get('/documents', null, renderNodes, 'json');
}

function renderNodes(arr) {
    for (i = 0; i < arr.length; i++) {
        renderNode(arr[i]);
    }
}

function renderNode(node) {
    $('#main-viewer').append(
            '<div class="node"><div class="node-header">' + node.filename + '</div>' +
                '<div class="node-body"><ul><li>Author: ' + node.author + '</li><li>Version: ' + node.version + '</ul></div></div>');
}
