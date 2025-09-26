import React from "react"

import { AvlLayer } from "~/submodules/avl-map-2/src"

import RenderComponent from "./RenderComponent"
import RisSearchInfoBox from "./RisSearchInfoBox"
import HoverComp from "./HoverComp"

const LAYER_ID = "ris-checkpoint-2-layer";

class ConflationToolsLayer extends AvlLayer {
	constructor(config, startActive) {
		super({ id: LAYER_ID, name: "RIS Tools Layer" });

		Object.assign(this, config);

		this.sources = makeSources(config);

		this.layers = makeLayers(config);

		this.startActive = Boolean(startActive);
	}
	startState = {
		clickedPoint: null,
		clickedProblemRIS: null,
		filteredRIS: []
	}
	onClick = {
		layers: ["maplibreMap", "problem-ris"],
		callback: function(layerId, features, lngLat, point, event) {
			if (layerId === "problem-ris") {
				const ris_id = features[0].properties.ris_id;
				this.updateState({ clickedProblemRIS: ris_id });
			}
			else if ((layerId === "maplibreMap") && event.ctrlKey) {
				this.updateState({ clickedPoint: { ...lngLat } });
			}
		}
	}
	onHover = {
		layers: ["ris-checkpoint-2", "ris-checkpoint-3", "problem-ris"],
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
		{	Component: RisSearchInfoBox,
			Header: "RIS Search InfoBox"
		}
	]
	RenderComponent = RenderComponent
}

const layerFactory = (config, startActive) => {
	return new ConflationToolsLayer(config, startActive);
}
export default layerFactory;

const makeSources = config => {

	const {
		RIS_cp_2_source_id,
		RIS_cp_2_view_id,

		RIS_cp_3_source_id,
		RIS_cp_3_view_id,

		problem_RIS_source_id,
		problem_RIS_view_id
	} = config;

	return [
		{ 	"id": `npmrds2_s${ RIS_cp_3_source_id }_v${ RIS_cp_3_view_id }`,
	      	"source": {
	         	"type": "vector",
	         	"tiles": [
	            	`https://graph.availabs.org/dama-admin/npmrds2/tiles/${ RIS_cp_3_view_id }/{z}/{x}/{y}/t.pbf?cols=ris_id,result_type,miles`
	         	],
	      		"format": "pbf"
	      	}
	   	},
		{ 	"id": `npmrds2_s${ RIS_cp_2_source_id }_v${ RIS_cp_2_view_id }`,
	      	"source": {
	         	"type": "vector",
	         	"tiles": [
	            	`https://graph.availabs.org/dama-admin/npmrds2/tiles/${ RIS_cp_2_view_id }/{z}/{x}/{y}/t.pbf?cols=ris_id,ls_index,ris_index,result_type,rank,start_score,end_score,miles_score,miles`
	         	],
	      		"format": "pbf"
	      	}
	   	},
		{ 	"id": `npmrds2_s${ problem_RIS_source_id }_v${ problem_RIS_view_id }`,
	      	"source": {
	         	"type": "vector",
	         	"tiles": [
	            	`https://graph.availabs.org/dama-admin/npmrds2/tiles/${ problem_RIS_view_id }/{z}/{x}/{y}/t.pbf?cols=ris_id,miles,problems`
	         	],
	      		"format": "pbf"
	      	}
	   	}
	]
}

const makeLayers = config => {

	const {
		RIS_cp_2_source_id,
		RIS_cp_2_view_id,

		RIS_cp_3_source_id,
		RIS_cp_3_view_id,

		problem_RIS_source_id,
		problem_RIS_view_id
	} = config;

	return [
		{	"id": "problem-ris",
  		"type": "line",
  		"source": `npmrds2_s${ problem_RIS_source_id }_v${ problem_RIS_view_id }`,
  		"source-layer": `view_${ problem_RIS_view_id }`,
  		"paint": {
     		"line-offset": 12,
     		"line-color": "#ffffff",
     		"line-width": [
     			"case",
     			["boolean", ["feature-state", "hover"], false], 6,
     			3
     		]
  		}
 		},
		{	"id": "ris-checkpoint-3",
  		"type": "line",
  		"source": `npmrds2_s${ RIS_cp_3_source_id }_v${ RIS_cp_3_view_id }`,
  		"source-layer": `view_${ RIS_cp_3_view_id }`,
  		"minzoom": 10,
  		"paint": {
     		"line-offset": [
     			"case",
     			["==", ["get", "result_type"], "ris-base"],
     			6,
     			12
     		],
     		"line-color": [
     			"case",
     			["==", ["get", "result_type"], "ris-base"],
     			"#ffac1c",
     			"#3cb371"
     		],
     		"line-width": [
     			"case",
     			["boolean", ["feature-state", "hover"], false], 6,
     			3
     		]
  		}
 		},
		{	"id": "ris-checkpoint-2",
  		"type": "line",
  		"source": `npmrds2_s${ RIS_cp_2_source_id }_v${ RIS_cp_2_view_id }`,
  		"source-layer": `view_${ RIS_cp_2_view_id }`,
  		"paint": {
     		"line-offset": ["*", ["to-number", ["get", "rank"]], 6],
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
 		}
	]
}