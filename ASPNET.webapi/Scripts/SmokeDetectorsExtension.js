Autodesk.Viewing.theExtensionManager.registerExtension('SmokeDetectorsExtension', SmokeDetectorsExtension);
var detectors = [];

var arraydb = new Array();
refreshdatabase();



function refreshdatabase() {
    var xmlHttp = null;
    // Mozilla, Opera, Safari sowie Internet Explorer 7
    if (typeof XMLHttpRequest != 'undefined') {
        xmlHttp = new XMLHttpRequest();
    }
    if (!xmlHttp) {
        // Internet Explorer 6 und älter
        try {
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                xmlHttp = null;
            }
        }
    }
    if (xmlHttp) {
        xmlHttp.open('GET', 'exchange.json', true);
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4) {
                var datafromdb = (xmlHttp.responseText);

                arraydb = datafromdb.split(',');

            }
        };
        xmlHttp.send(null);
    }

}

function refreshsensordata() {
    refreshdatabase();
     
    for (var i = 0; i < detectors.length; i++) {
        
        var temp = "sensorvalue" + i;
        document.getElementById(temp).innerHTML = arraydb[i];
        
         
    }
    setTimeout(function () { refreshsensordata(); }, 3000); 
}




function SmokeDetectorsExtension(viewer, options) {
    Autodesk.Viewing.Extension.call(this, viewer, options);
}

SmokeDetectorsExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
SmokeDetectorsExtension.prototype.constructor = SmokeDetectorsExtension;

SmokeDetectorsExtension.prototype.load = function () {
    console.log('IoT extension is loaded')
    var viewer = this.viewer;

    //Get elements from the view
    var tree;

    viewer.addEventListener(Autodesk.Viewing.GEOMETRY_LOADED_EVENT, function () {
        console.log('Model loaded');
        
    });

    viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, function () {
        console.log('Tree loaded');
        tree = viewer.model.getData().instanceTree;

        var rootId = this.rootId = tree.getRootId();

        var rootName = tree.getNodeName(rootId);
        var childCount = 0;
        var list;

        tree.enumNodeChildren(rootId, function (childId) {
            var childName = tree.getNodeName(childId);
            detectors.push(childName);
            list += String(childName) + '\n';
        });
        //console.log('Root Elements' + list + 'Length ' + detectors.length);

        detectors = getAlldbIds(rootId, tree);
        for (var i = 0; i < length; i++) {

        }

        var content = document.createElement('div');
        var mypanel = new SimplePanel(viewer.container, 'iotpanel', 'IoT Detectors List', content, 20, 20);
        mypanel.setVisible(true);

        
        
    });
    

    return true;
};

SmokeDetectorsExtension.prototype.unload = function () {
    alert('IoT is now unloaded!');
    return true;
};

SimplePanel = function (parentContainer, id, title, content, x, y) {
    console.log('Iot panel loaded');
    this.content = content;
    Autodesk.Viewing.UI.DockingPanel.call(this, parentContainer, id, title, { shadow: false });

    // Auto-fit to the content and don't allow resize.  Position at the coordinates given.
    //
    this.container.style.height = "auto";
    this.container.style.width = "auto";
    this.container.style.resize = 'both';
    this.container.style.left = x + "px";
    this.container.style.top = y + "px";
};

SimplePanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
SimplePanel.prototype.constructor = SimplePanel;

SimplePanel.prototype.initialize = function () {
    this.title = this.createTitleBar(this.titleLabel || this.container.id);
    this.container.appendChild(this.title);

    this.container.appendChild(this.content);
    this.initializeMoveHandlers(this.container);

    this.closer = this.createCloseButton();
    this.title.appendChild(this.closer);

    var op = { left: false, heightAdjustment: 45, marginTop: 0 };
    this.scrollcontainer = this.createScrollContainer(op);

    var html = [
        '<div class="uicomponent-panel-controls-container">',
        '<div class="panel panel-default">',
        '<table class="table table-bordered table-inverse" id = "clashresultstable">',
        '<thead>',
        '<th>ID</th><th>Status</th>',
        '</thead>',
        '<tbody>'].join('\n');

    for (var i = 0; i < detectors.length; i++) {
        html += ['<tr><td>' + detectors[i] + '</td><td id=sensorvalue' + i +'>' + arraydb[i]+'</td></tr>'].join('\n');
    }

    html += ['</tbody>',
        '</table>',
        '</div>',
        '</div>'
    ].join('\n');

    $(this.scrollContainer).append(html);

    this.initializeMoveHandlers(this.title);
    this.initializeCloseHandler(this.closer);
};

//Selecting elements from viewer

function getAlldbIds(rootId, tree) {
    var allDBId = [];
    var elementsNames = [];

    if (!rootId) {
        return allDBId;
    }

    var queue = [];
    queue.push(rootId);
    while (queue.length > 0) {
        var node = queue.shift();
        allDBId.push(node);
        tree.enumNodeChildren(node, function (childrenIds) {
            queue.push(childrenIds);
        });
    };

    var list;

    for (var i = 0; i < allDBId.length; i++) {
        
        if (tree.getNodeName(allDBId[i]).includes('RAUCH')) {
            //alert(tree.getNodeName(allDBId[i]));
            elementsNames.push(tree.getNodeName(allDBId[i]));
        }
        //elementsNames.push(tree.getNodeName(allDBId[i]));
        list += tree.getNodeName(allDBId[i]) + '\n';
    }

    console.log(list);
    return elementsNames;
};
