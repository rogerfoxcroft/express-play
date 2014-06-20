$(function() {
    $('.message-banner').hide();
    initDropzone();
    vex.defaultOptions.className = 'vex-theme-plain';
});

var lastTimeout;

function showMessage(msg) {
    if (lastTimeout != null) {
        clearTimeout(lastTimeout);
    }

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
            this.on('success', function(file) {
                NProgress.done();
                showMessage('File "' + file.name + '" successfully uploaded');
                this.removeFile(file);
            });
            this.on('error', function(file, error) {
                NProgress.done();
                vex.dialog.alert(error);
                this.removeFile(file);
            })
        }
    });
}
