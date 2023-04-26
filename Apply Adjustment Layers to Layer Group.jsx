app.activeDocument.suspendHistory("Script", "main()")

function cTID(s) { return app.charIDToTypeID(s) }
function sTID(s) { return app.stringIDToTypeID(s) }

function isAdjustmentLayer(layer) {
  var ref = new ActionReference()
  ref.putIdentifier(charIDToTypeID("Lyr "), layer.id)
  var desc = executeActionGet(ref)
  var layerType = typeIDToStringID(desc.getEnumerationValue(stringIDToTypeID('layerSection')))
  if (layerType != 'layerSectionContent') return false
  return desc.hasKey(stringIDToTypeID('adjustment'))
}

function newGroupFromLayers() {
  var desc = new ActionDescriptor()
  var ref = new ActionReference()
  ref.putClass( sTID('layerSection') )
  desc.putReference( cTID('null'), ref )
  var lref = new ActionReference()
  lref.putEnumerated( cTID('Lyr '), cTID('Ordn'), cTID('Trgt') )
  desc.putReference( cTID('From'), lref)
  executeAction( cTID('Mk  '), desc, DialogModes.NO )
}

function main() {
  var doc = activeDocument

  newGroupFromLayers()
  var group = doc.activeLayer
  var layers = group.layers

  for (var i = 0; i < layers.length; i++) {
    var adjLayer = layers[i]

    if (!isAdjustmentLayer(adjLayer)) {
      alert('please, select an adjustment layer.')
      return
    }

    try {
      var targetGroup = doc.layerSets.getByName('target')
      var artLayers = targetGroup.artLayers

      for (var j = 0; j < artLayers.length; j++) {
        if (!artLayers[j].allLocked && !isAdjustmentLayer(artLayers[j])) {
          var copy = adjLayer.duplicate(artLayers[j], ElementPlacement.PLACEBEFORE)
          doc.activeLayer = copy
          executeAction(stringIDToTypeID("mergeLayersNew"), undefined, DialogModes.NO)
        }
      }
    } catch(err) {
      alert(err)
    }
  }

  group.remove()
}