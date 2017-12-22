

$(document).ready(function () {
    prepareAppBucketTree();
    $('#refreshBuckets').click(function () {
        $('#appBuckets').jstree(true).refresh();
    });

    $('#createNewBucket').click(function () {
        createNewBucket();
    });

    $('#createBucketModal').on('shown.bs.modal', function () {
        $("#newBucketKey").focus();
    })
});

function createNewBucket() {
    var bucketKey = $('#newBucketKey').val();
    var policyKey = $('#newBucketPolicyKey').val();
    jQuery.post({
        url: '/api/forge/buckets/createBucket',
        data: { 'bucketKey': bucketKey, 'policyKey': policyKey },
        success: function (res) {
            $('#appBuckets').jstree(true).refresh();
            $('#createBucketModal').modal('toggle');
        },
    });
}

function prepareAppBucketTree() {
    $('#appBuckets').jstree({
        'core': {
            'themes': { "icons": true },
            'data': {
                "url": '/api/forge/tree',
                "dataType": "json",
                'multiple': false,
                "data": function (node) {
                    return { "id": node.id };
                }
            }
        },
        'types': {
            'default': {
                'icon': 'glyphicon glyphicon-question-sign'
            },
            '#': {
                'icon': 'glyphicon glyphicon-cloud'
            },
            'bucket': {
                'icon': 'glyphicon glyphicon-folder-open'
            },
            'object': {
                'icon': 'glyphicon glyphicon-file'
            }
        },
        "plugins": ["types", "state", "sort", "contextmenu"],
        contextmenu: { items: autodeskCustomMenu }
    }).on('loaded.jstree', function () {
        $('#appBuckets').jstree('open_all');
    }).bind("activate_node.jstree", function (evt, data) {
        if (data != null && data.node != null && data.node.type=='object') {
            launchViewer(data.node.id);
            console.log(data.node.id);
        }
    });
}

function autodeskCustomMenu(autodeskNode) {
    var items;

    switch (autodeskNode.type){
        case "bucket":
            items = {
                uploadFile: {
                    label: "Upload file",
                    icon: "/Images/upload.png",
                    action: function () {
                        var treeNode = $('#appBuckets').jstree(true).get_selected(true)[0];
                        uploadFile(treeNode);
                    }
                }
            };
            break;
        case "object":
            items = {
                translateFile: {
                    label: "Translate",
                    icon: "/Images/icon-model-derive.svg",
                    action: function () {
                        var treeNode = $('#appBuckets').jstree(true).get_selected(true)[0];
                        translateObject(treeNode);
                    }
                }
            };
            break;
    }

    return items;
}

function uploadFile(node) {
    $('#hiddenUploadField').click();
    $('#hiddenUploadField').change(function () {
        var file = this.files[0];
        //size = file.size;
        //type = file.type;
        switch (node.type) {
            // case 'projects' // ToDo
            case 'bucket':
                var formData = new FormData();
                formData.append('fileToUpload', file);
                formData.append('bucketKey', node.id);

                $.ajax({
                    url: '/api/forge/buckets/uploadObject',
                    data: formData,
                    processData: false,
                    contentType: false,
                    type: 'POST',
                    success: function (data) {
                        $('#appBuckets').jstree(true).refresh_node(node);
                    }
                });

                /*
                 // upload with progress bar ToDo
                 var xhr = new XMLHttpRequest();
                 xhr.open('post', '/api/upload', true);
                 xhr.upload.onprogress = function (e) {
                 if (e.lengthComputable) {
                 //var percentage = (e.loaded / e.total) * 100;
                 //$('div.progress div.bar').css('width', percentage + '%');
                 }
                 };
                 xhr.onload = function () {
                 }
                 xhr.send(formData);
                 */
                break;
        }
    });
}

function translateObject(node) {
    var bucketKey = node.parents[0];
    var objectKey = node.id;
    if (node.text.indexOf('.zip') > 0) {
        $("#rootFileModal").modal();
        $("#translateZipObject").click(function () {
            $('#rootFileModal').modal('toggle');
            jQuery.post({
                url: '/api/forge/modelderivative/translateObject',
                data: { 'bucketKey': bucketKey, 'objectKey': objectKey , 'rootFilename': $("#rootFilename").val()},
                success: function (res) {
                    //$('#appBuckets').jstree(true).refresh();
                },
            });
        });
    }
    else {
        jQuery.post({
            url: '/api/forge/modelderivative/translateObject',
            data: { 'bucketKey': bucketKey, 'objectKey': objectKey },
            success: function (res) {
                //$('#appBuckets').jstree(true).refresh();
            },
        });
    }
}
