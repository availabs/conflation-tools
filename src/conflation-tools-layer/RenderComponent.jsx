import React from "react"

const RenderComponent = props => {
	const { maplibreMap, layerState, setLayerVisibility, layerVisibilities } = props;
	const { filteredTMCs } = layerState;

	React.useEffect(() => {
		if (maplibreMap.getLayer("checkpoint-2")) {
			maplibreMap.setFilter(
				'checkpoint-2',
				["in", ["get", "tmc"], ["literal", filteredTMCs]]
			);
		}
	}, [maplibreMap, filteredTMCs]);

	React.useEffect(() => {
		if (maplibreMap.getLayer("checkpoint-3")) {
			if (!filteredTMCs.length) {
				maplibreMap.setFilter('checkpoint-3', null);
			}
			else {
				maplibreMap.setFilter(
					'checkpoint-3',
					["in", ["get", "tmc"], ["literal", filteredTMCs]]
				)
			}
		}
	}, [maplibreMap, filteredTMCs]);

	React.useEffect(() => {
		if (maplibreMap.getLayer("problem-tmcs")) {
			if (!filteredTMCs.length) {
				maplibreMap.setFilter('problem-tmcs', null);
			}
			else {
				maplibreMap.setFilter(
					'problem-tmcs',
					["in", ["get", "tmc"], ["literal", filteredTMCs]]
				)
			}
		}
	}, [maplibreMap, filteredTMCs]);

	const cp2visibility = layerVisibilities["checkpoint-2"];
	const toggleCheckpoint2Visibility = React.useCallback(e => {
		setLayerVisibility("checkpoint-2", cp2visibility === "visible" ? "none" : "visible");
	}, [maplibreMap, setLayerVisibility, cp2visibility]);

	const cp3visibility = layerVisibilities["checkpoint-3"];
	const toggleCheckpoint3Visibility = React.useCallback(e => {
		setLayerVisibility("checkpoint-3", cp3visibility === "visible" ? "none" : "visible");
	}, [maplibreMap, setLayerVisibility, cp3visibility]);

	const problemTMCsVisibility = layerVisibilities["problem-tmcs"];
	const toggleProblemTMCsVisibility = React.useCallback(e => {
		setLayerVisibility("problem-tmcs", problemTMCsVisibility === "visible" ? "none" : "visible");
	}, [maplibreMap, setLayerVisibility, problemTMCsVisibility]);

	return (
		<div className="w-60 grid grid-cols-1 gap-2">

			<button onClick={ toggleCheckpoint2Visibility }
				className={ `
					py-3 px-4 rounded-lg pointer-events-auto
					bg-gray-100 hover:bg-gray-400 cursor-pointer
					flex items-center w-60
				` }
			>
				<span className={ cp2visibility === "none" ?
									"fa fa-eye-slash text-2xl" :
									"fa fa-eye text-2xl" }/>
				<span className="ml-2 flex-1 text-right">
					{ cp2visibility === "none" ? "Show " : "Hide " }
					Checkpoint 2
				</span>
			</button>

			<button onClick={ toggleCheckpoint3Visibility }
				className={ `
					py-3 px-4 rounded-lg pointer-events-auto
					bg-gray-100 hover:bg-gray-400 cursor-pointer
					flex items-center w-60
				` }
			>
				<span className={ cp3visibility === "none" ?
									"fa fa-eye-slash text-2xl" :
									"fa fa-eye text-2xl" }/>
				<span className="ml-2 flex-1 text-right">
					{ cp3visibility === "none" ? "Show " : "Hide " }
					Checkpoint 3
				</span>
			</button>

			<button onClick={ toggleProblemTMCsVisibility }
				className={ `
					py-3 px-4 rounded-lg pointer-events-auto
					bg-gray-100 hover:bg-gray-400 cursor-pointer
					flex items-center w-60
				` }
			>
				<span className={ problemTMCsVisibility === "none" ?
									"fa fa-eye-slash text-2xl" :
									"fa fa-eye text-2xl" }/>
				<span className="ml-2 flex-1 text-right">
					{ problemTMCsVisibility === "none" ? "Show " : "Hide " }
					Problem TMCs
				</span>
			</button>

		</div>
	);
}

export default RenderComponent;