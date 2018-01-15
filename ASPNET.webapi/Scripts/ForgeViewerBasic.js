// This script file is based on the tutorial:
// https://developer.autodesk.com/en/docs/viewer/v2/tutorials/basic-application/

var viewerApp;

function launchViewer(urn) {
    var options = {
        env: 'AutodeskProduction',
        getAccessToken: getAccessToken
    };
    var documentId = 'urn:' + urn;
    var config3d = {
        extensions: ['SmokeDetectorsExtension','Autodesk.ADN.Viewing.Extension.Basic'] };
    Autodesk.Viewing.Initializer(options, function onInitialized() {
        viewerApp = new Autodesk.Viewing.ViewingApplication('forgeViewer');
        viewerApp.registerViewer(viewerApp.k3D, Autodesk.Viewing.Private.GuiViewer3D, config3d);
        viewerApp.loadDocument(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
        
    });
}

var viewer;



function onDocumentLoadSuccess(doc) {

    //use bubbles
    var viewables = viewerApp.bubble.search({ 'type': 'geometry' });
    if (viewables.length === 0) {
        console.error('Document contains no viewables.');
        return;
    }

    // Choose any of the avialble viewables
    viewerApp.selectItem(viewables[0].data, onItemLoadSuccess, onItemLoadFail);
}

function onDocumentLoadFailure(viewerErrorCode) {
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function onItemLoadSuccess(viewer, item) {
    //console.log('onItemLoadSuccess()!');
    //console.log(viewer);
    //console.log(item);
    

    //console.log('Viewers are equal: ' + (viewer === viewerApp.getCurrentViewer()));
}

function onItemLoadFail(errorCode) {
    console.error('onItemLoadFail() - errorCode:' + errorCode);
}

function getAccessToken() {
    var token = '';
    jQuery.ajax({
        url: '/api/forge/oauth/token',
        success: function (res) {
            token = res;
        },
        async: false // this request must be synchronous for the Forge Viewer
    });
    if (token != '') console.log('2 legged token: ' + token); // debug
    return token;
}