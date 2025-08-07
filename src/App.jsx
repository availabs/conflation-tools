import React from "react"

import { AvlMap } from "~/submodules/avl-map-2/src"

import ConflationToolsLayerFactory from "./conflation-tools-layer"

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
      setLayers([ConflationToolsLayerFactory(config)]);
    }
  }, [config, layers]);

  return (
    <div className="w-screen h-screen relative">
      <AvlMap
        layers={ layers }
        mapOptions={ { zoom: 9 } }/>
    </div>
  )
}

export default App
