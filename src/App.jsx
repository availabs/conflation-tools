import React from "react"

import { AvlMap } from "~/submodules/avl-map-2/src"

import NpmrdsToolsLayerFactory from "./npmrds-tools-layer"
import RisToolsLayerFactory from "./ris-tools-layer"

const MapOptions = { zoom: 9 };

function App() {

  const [config, setConfig] = React.useState(null);

  React.useEffect(() => {
    fetch("http://localhost:4444/conflation-data/npmrds2")
      .then(res => res.json())
      .then(json => {
        if (json.ok) {
          setConfig({ ...json.result });
        }
        else {
          console.error("COULD NOT RETRIEVE CONFIG");
        }
      })
  }, []);

  const [layers, setLayers] = React.useState([]);

  React.useEffect(() => {
    if (config && !layers.length) {
      setLayers([
        NpmrdsToolsLayerFactory(config, false),
        RisToolsLayerFactory(config, true)
      ]);
    }
  }, [config, layers]);

  return (
    <div className="w-screen h-screen relative">
      <AvlMap
        layers={ layers }
        mapOptions={ MapOptions }/>
    </div>
  )
}

export default App
