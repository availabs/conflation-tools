import React from "react"

import { AvlLayer } from "~/submodules/avl-map-2/src"

import RenderComponent from "./RenderComponent"
import HoverComp from "./HoverComp"

const problem_TMCs_source_id = 1365;
const problem_TMCs_view_id = 2522;

const LAYER_ID = "problem-tmcs-layer";

class ProblemTMCsLayer extends AvlLayer {
	constructor() {
		super({ id: LAYER_ID, name: "Problem TMCs Layer" });

		this.problem_TMCs_source_id = problem_TMCs_source_id;
		this.problem_TMCs_view_id = problem_TMCs_view_id;
	}
	startState = {
	}
	onHover = {
		layers: ["problem-tmcs"],
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
	]
	RenderComponent = RenderComponent
	sources = [
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
	layers = [
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
   		}
	]
}

const layerFactory = options => {
	options = options || {};
	return new ProblemTMCsLayer(options);
}
export default layerFactory;