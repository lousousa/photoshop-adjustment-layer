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

    if (! isAdjustmentLayer(adjLayer)) {
      alert('please, select an adjustment layer.')
      return
    }

    try {
      var applyGroup = doc.layerSets.getByName('target')
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
  }

  group.remove()
  return
}