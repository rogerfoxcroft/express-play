$(function() {
    $('.message-banner').hide();
    initDropzone();
    vex.defaultOptions.className = 'vex-theme-plain';

    refreshFileViewer();
});

var lastTimeout;

function showMessage(msg) {
    // Clear the last timeout if a new message came in - timeout starts again
    if (lastTimeout != null) {
        clearTimeout(lastTimeout);
    }

    // Clear the old message content and replace with the new, ensuring that the item is shown in case it has already faded
    $('.message-banner').finish().show();
    $('.message-banner p').text(msg);

    lastTimeout = setTimeout(function() {
        $('.message-banner').fadeOut('slow', function() {
            $('.message-banner p').empty();
        })}, 10000);
}

function initDropzone() {
    new Dropzone(".main-content", {
        url: "/upload",
        clickable: false,
        autoProcessQueue: true,
        createImageThumbnails: false,
        dictDefaultMessage: '',
        init: function() {
            this.on('addedfile', function() {
                NProgress.start();
            });
            this.on('success', function(file, res) {
                NProgress.done();
                showMessage('File "' + file.name + '" successfully uploaded');
                this.removeFile(file);

                // Rerender the view
                refreshFileViewer();
            });
            this.on('error', function(file, error) {
                NProgress.done();
                vex.dialog.alert(error);
                this.removeFile(file);
            })
        }
    });
}
