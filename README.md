# Photoshop Script Utility
## Apply an Adjustment Layer to a Group

This Photoshop script utility allows it to apply an adjustment layer in a group of several layers.

### Demonstration
![preview](https://user-images.githubusercontent.com/2921281/138190027-abd4eeeb-fcc2-4976-99f5-2d67e1e771e8.gif)

### How to install
[TODO]

### How to use
[TODO]

### Raw code
```
app.activeDocument.suspendHistory("Script", "f()")

function f() {
    var doc = activeDocument
    var adjLayer = doc.activeLayer

    if (! isAdjustmentLayer(adjLayer)) {
        alert('please, select an adjustment layer.')
        return
    }

    try {
        var applyGroup = doc.layerSets.getByName('apply')
        var artLayers = applyGroup.artLayers
        
        for (var i = 0; i < artLayers.length; i++) {
            if (!artLayers[i].allLocked && !isAdjustmentLayer(artLayers[i])) {
                var copy = adjLayer.duplicate(artLayers[i], ElementPlacement.PLACEBEFORE)
                doc.activeLayer = copy
                executeAction(stringIDToTypeID("mergeLayersNew"), undefined, DialogModes.NO)
            }
        }

        adjLayer.remove()
    } catch(err) {
        alert(err)
    }
    return
}

function isAdjustmentLayer(layer) {
    var ref = new ActionReference()
    ref.putIdentifier(charIDToTypeID("Lyr "), layer.id)
    var desc = executeActionGet(ref)
    var layerType = typeIDToStringID(desc.getEnumerationValue(stringIDToTypeID('layerSection')))
    if (layerType != 'layerSectionContent') return false
    return desc.hasKey(stringIDToTypeID('adjustment'))
}
```
