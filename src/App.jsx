import React from "react"

import { AvlMap } from "~/submodules/avl-map-2/src"

import ConflationToolsLayerFactory from "./conflation-tools-layer"

function App() {

  const layersRef = React.useRef([
    ConflationToolsLayerFactory()
  ]);

  return (
    <div className="w-screen h-screen relative">
      <AvlMap
        layers={ layersRef.current }
        mapOptions={ { zoom: 9 } }/>
    </div>
  )
}

export default App
