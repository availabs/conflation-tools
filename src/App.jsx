import React from "react"

import { AvlMap } from "~/submodules/avl-map-2/src"

import NpmrdsToolsLayerFactory from "./npmrds-tools-layer"
import RisToolsLayerFactory from "./ris-tools-layer"
import PgRouterLayerFactory from "./pg-router-layer"

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
      .catch(error => console.error("CONFLATION DATA ERROR:", error))
  }, []);

  const pgRouterLayer = React.useRef(PgRouterLayerFactory(config, true));

  const [layers, setLayers] = React.useState([pgRouterLayer.current]);

  React.useEffect(() => {
    if (config && !layers.length) {
      setLayers([
        NpmrdsToolsLayerFactory(config, false),
        RisToolsLayerFactory(config, true),
        pgRouterLayer.current
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
