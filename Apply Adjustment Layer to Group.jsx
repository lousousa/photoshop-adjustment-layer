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