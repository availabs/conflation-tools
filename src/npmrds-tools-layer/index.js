import React from "react"

import { AvlLayer } from "~/submodules/avl-map-2/src"

import RenderComponent from "./RenderComponent"
import TmcSearchInfoBox from "./TmcSearchInfoBox"
// import PgRouterInfoBox from "./PgRouterInfoBox"
import HoverComp from "./HoverComp"

const LAYER_ID = "npmrds-checkpoint-2-layer";

class ConflationToolsLayer extends AvlLayer {
	constructor(config, startActive) {
		super({ id: LAYER_ID, name: "NPMRDS Tools Layer" });

		Object.assign(this, config);

		this.sources = makeSources(config);

		this.layers = makeLayers(config);

		this.startActive = Boolean(startActive);
	}
	startState = {
		// clickedPoint: null,
		clickedProblemTMC: null,
		filteredTMCs: []
	}
	onClick = {
		layers: ["problem-tmcs"],
		callback: function(layerId, features, lngLat, point, event) {
			if (layerId === "problem-tmcs") {
				const tmc = features[0].properties.tmc;
				this.updateState({ clickedProblemTMC: tmc });
			}
			// else if ((layerId === "maplibreMap") && event.ctrlKey) {
			// 	this.updateState({ clickedPoint: { ...lngLat } });
			// }
		}
	}
	onHover = {
		layers: ["path-nodes", "path", "npmrds-checkpoint-2", "npmrds-checkpoint-3", "problem-tmcs"],
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
		{	Component: TmcSearchInfoBox,
			Header: "TMC Search InfoBox"
		},
		// {	Component: PgRouterInfoBox,
		// 	Header: "PG Router InfoBox"
		// }
	]
	RenderComponent = RenderComponent
}

const layerFactory = (config, startActive) => {
	return new ConflationToolsLayer(config, startActive);
}
export default layerFactory;

const makeSources = config => {

	const {
		NPMRDS_cp_2_source_id,
		NPMRDS_cp_2_view_id,

		NPMRDS_cp_3_source_id,
		NPMRDS_cp_3_view_id,

		problem_TMCs_source_id,
		problem_TMCs_view_id
	} = config;

	return [
		// {	"id": "path-nodes-source",
		// 	"source": {
		// 		"type": "geojson",
		// 		"data": {
		// 			"type": "FeatureCollection",
		// 			"features": []
		// 		}
		// 	}
		// },
		// {	"id": "path-source",
		// 	"source": {
		// 		"type": "geojson",
		// 		"data": {
		// 			"type": "FeatureCollection",
		// 			"features": []
		// 		}
		// 	}
		// },
		{ 	"id": `npmrds2_s${ NPMRDS_cp_3_source_id }_v${ NPMRDS_cp_3_view_id }`,
	      	"source": {
	         	"type": "vector",
	         	"tiles": [
	            	`https://graph.availabs.org/dama-admin/npmrds2/tiles/${ NPMRDS_cp_3_view_id }/{z}/{x}/{y}/t.pbf?cols=tmc,result_type,miles`
	         	],
	      		"format": "pbf"
	      	}
	   	},
		{ 	"id": `npmrds2_s${ NPMRDS_cp_2_source_id }_v${ NPMRDS_cp_2_view_id }`,
	      	"source": {
	         	"type": "vector",
	         	"tiles": [
	            	`https://graph.availabs.org/dama-admin/npmrds2/tiles/${ NPMRDS_cp_2_view_id }/{z}/{x}/{y}/t.pbf?cols=tmc,linestring_index,tmc_index,result_type,rank,start_score,end_score,miles_score,miles`
	         	],
	      		"format": "pbf"
	      	}
	   	},
		{ 	"id": `npmrds2_s${ problem_TMCs_source_id }_v${ problem_TMCs_view_id }`,
	      	"source": {
	         	"type": "vector",
	         	"tiles": [
	            	`https://graph.availabs.org/dama-admin/npmrds2/tiles/${ problem_TMCs_view_id }/{z}/{x}/{y}/t.pbf?cols=tmc,miles,problems`
	         	],
	      		"format": "pbf"
	      	}
	   	}
	]
}

const makeLayers = config => {

	const {
		NPMRDS_cp_2_source_id,
		NPMRDS_cp_2_view_id,

		NPMRDS_cp_3_source_id,
		NPMRDS_cp_3_view_id,

		problem_TMCs_source_id,
		problem_TMCs_view_id
	} = config;

	return [
		{	"id": "problem-tmcs",
  		"type": "line",
  		"source": `npmrds2_s${ problem_TMCs_source_id }_v${ problem_TMCs_view_id }`,
  		"source-layer": `view_${ problem_TMCs_view_id }`,
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
		{	"id": "npmrds-checkpoint-3",
  		"type": "line",
  		"source": `npmrds2_s${ NPMRDS_cp_3_source_id }_v${ NPMRDS_cp_3_view_id }`,
  		"source-layer": `view_${ NPMRDS_cp_3_view_id }`,
  		"minzoom": 10,
  		"paint": {
     		"line-offset": [
     			"case",
     			["==", ["get", "result_type"], "tmc-base"],
     			6,
     			12
     		],
     		"line-color": [
     			"case",
     			["==", ["get", "result_type"], "tmc-base"],
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
		{	"id": "npmrds-checkpoint-2",
  		"type": "line",
  		"source": `npmrds2_s${ NPMRDS_cp_2_source_id }_v${ NPMRDS_cp_2_view_id }`,
  		"source-layer": `view_${ NPMRDS_cp_2_view_id }`,
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
 		},
		// {	"id": "path-nodes",
		// 	"type": "circle",
		// 	"source": "path-nodes-source",
		// 	"paint": {
		// 		"circle-radius": 5,
		// 		"circle-color": "white"
		// 	}
		// },
		// {	"id": "path",
		// 	"type": "line",
		// 	"source": "path-source",
		// 	"paint": {
		// 		"line-width": 3,
		// 		"line-color": "white",
		// 		"line-offset": 3
		// 	}
		// }
	]
}