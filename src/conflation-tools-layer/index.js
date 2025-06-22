import React from "react"

import { AvlLayer } from "~/submodules/avl-map-2/src"

import RenderComponent from "./RenderComponent"
import InfoBox from "./InfoBox"

class ConflationToolsLayer extends AvlLayer {
	constructor() {
		super();
	}
	startState = {
		clickedPoint: null
	}
	onClick = {
		layers: ["maplibreMap"],
		callback: function(layerId, features, lngLat, point) {
			this.updateState({ clickedPoint: { ...lngLat } });
		}
	}
	onHover = {
		layers: ["path-nodes", "path", "checkpoint-2"],
		callback: function(layerId, features, lngLat, point) {
			switch (layerId) {
				case "path-nodes":
					return features.map(f => [f.properties]);
				case "path":
					return features.map(f => [f.properties]);
			}
			// console.log("ON HOVER:", layerId, features);
			return ["some", "data", "here"];
		},
		pinnable: true
	}
	infoBoxes = [
		{	Component: InfoBox,
			Header: "MY INFO BOX"
		}
	]
	RenderComponent = RenderComponent
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
		},
		{ 	"id": "npmrds2_s1103_v2174_1750516805111",
	      	"source": {
	         	"type": "vector",
	         	"tiles": [
	            	"https://graph.availabs.org/dama-admin/npmrds2/tiles/2174/{z}/{x}/{y}/t.pbf?cols=ogc_fid,rank,tmc"
	         	],
	      		"format": "pbf"
	      	}
	   	}
	]
	layers = [
		{	"id": "checkpoint-2",
      		"type": "line",
      		"source": "npmrds2_s1103_v2174_1750516805111",
      		"source-layer": "view_2174",
      		"paint": {
         		"line-offset": [
         			"*", ["to-number", ["get", "rank"]], 3
         		],
         		"line-color": [
         			"case",
         			["==", ["to-number", ["get", "rank"]], 3], "#ff0000",
         			["==", ["to-number", ["get", "rank"]], 2], "#0000ff",
         			["==", ["to-number", ["get", "rank"]], 1], "#00ff00",
         			"#ff00ff"
         		],
         		"line-width": [
         			"case",
         			["boolean", ["feature-state", "hover"], false], 6,
         			3
         		]
      		}
   		},
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

const layerFactory = options => {
	options = options || {};
	return new ConflationToolsLayer(options);
}
export default layerFactory;