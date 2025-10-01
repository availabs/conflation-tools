import React from "react"

import { AvlLayer } from "~/submodules/avl-map-2/src"

import PgRouterInfoBox from "./PgRouterInfoBox"
import HoverComp from "./HoverComp"

const LAYER_ID = "pg-router-layer";

class PgRouterLayer extends AvlLayer {
	constructor(config, startActive) {
		super({ id: LAYER_ID, name: "PG Router Layer" });

		Object.assign(this, config);

		this.startActive = Boolean(startActive);
	}
	startState = {
		clickedPoint: null
	}
	onClick = {
		layers: ["maplibreMap"],
		callback: function(layerId, features, lngLat, point, event) {
			if ((layerId === "maplibreMap") && event.ctrlKey) {
				this.updateState({ clickedPoint: { ...lngLat } });
			}
		}
	}
	onHover = {
		layers: ["path-nodes", "path"],
		Component: HoverComp,
		callback: function(layerId, features, lngLat, point) {
			if (features) {
				return features.map(f => [f.properties]);
			}
			return [layerId];
		},
		pinnable: true
	}
	infoBoxes = [
		{	Component: PgRouterInfoBox,
			Header: "PG Router InfoBox"
		}
	]
	sources = [
		{	"id": "path-nodes-source",
			"source": {
				"type": "geojson",
				"data": {
					"type": "FeatureCollection",
					"features": []
				}
			}
		},
		{	"id": "path-source",
			"source": {
				"type": "geojson",
				"data": {
					"type": "FeatureCollection",
					"features": []
				}
			}
		}
	]
	layers = [,
		{	"id": "path-nodes",
			"type": "circle",
			"source": "path-nodes-source",
			"paint": {
				"circle-radius": 5,
				"circle-color": "white"
			}
		},
		{	"id": "path",
			"type": "line",
			"source": "path-source",
			"paint": {
				"line-width": 3,
				"line-color": "white",
				"line-offset": 3
			}
		}
	]
}

const layerFactory = (config, startActive) => {
	return new PgRouterLayer(config, startActive);
}
export default layerFactory;