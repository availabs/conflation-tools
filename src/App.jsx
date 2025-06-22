import React from "react"

import { AvlMap } from "~/submodules/avl-map-2/src"

import ConflationToolsLayerFactory from "./conflation-tools-layer"

function App() {
  const ctLayerRef = React.useRef([ConflationToolsLayerFactory()]);
  return (
    <div className="w-screen h-screen relative">
      <AvlMap
        layers={ ctLayerRef.current }/>
    </div>
  )
}

export default App
