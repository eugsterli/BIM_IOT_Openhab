AutodeskNamespace("Autodesk.ADN.Viewing.Extension");


Autodesk.ADN.Viewing.Extension.Basic = function (viewer, options) {

    Autodesk.Viewing.Extension.call(this, viewer, options);

    var _this = this;

    _this.load = function () {

        viewer.addEventListener(Autodesk.Viewing.FULLSCREEN_MODE_EVENT, function (e) {

            setTimeout(function () { viewer.setThemingColor(3910, new THREE.Vector4(0, 1, 1, 1)); }, 3000); 
         
        })
        
        return true;
    };

    _this.unload = function () {

        return true;
    };
};

Autodesk.ADN.Viewing.Extension.Basic.prototype =
    Object.create(Autodesk.Viewing.Extension.prototype);

Autodesk.ADN.Viewing.Extension.Basic.prototype.constructor =
    Autodesk.ADN.Viewing.Extension.Basic;

Autodesk.Viewing.theExtensionManager.registerExtension(
    "Autodesk.ADN.Viewing.Extension.Basic",
    Autodesk.ADN.Viewing.Extension.Basic);