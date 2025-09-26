import React from "react"

const RenderComponent = props => {
	const { maplibreMap, layerState, setLayerVisibility, layerVisibilities } = props;
	const { filteredRIS } = layerState;

	React.useEffect(() => {
		if (maplibreMap.getLayer("ris-checkpoint-2")) {
			maplibreMap.setFilter(
				'ris-checkpoint-2',
				["in", ["get", "ris_id"], ["literal", filteredRIS]]
			);
		}
	}, [maplibreMap, filteredRIS]);

	React.useEffect(() => {
		if (maplibreMap.getLayer("ris-checkpoint-3")) {
			if (!filteredRIS.length) {
				maplibreMap.setFilter('ris-checkpoint-3', null);
			}
			else {
				maplibreMap.setFilter(
					'ris-checkpoint-3',
					["in", ["get", "ris_id"], ["literal", filteredRIS]]
				)
			}
		}
	}, [maplibreMap, filteredRIS]);

	React.useEffect(() => {
		if (maplibreMap.getLayer("problem-ris")) {
			if (!filteredRIS.length) {
				maplibreMap.setFilter('problem-ris', null);
			}
			else {
				maplibreMap.setFilter(
					'problem-ris',
					["in", ["get", "ris_id"], ["literal", filteredRIS]]
				)
			}
		}
	}, [maplibreMap, filteredRIS]);

	const cp2visibility = layerVisibilities["ris-checkpoint-2"];
	const toggleCheckpoint2Visibility = React.useCallback(e => {
		setLayerVisibility("ris-checkpoint-2", cp2visibility === "visible" ? "none" : "visible");
	}, [maplibreMap, setLayerVisibility, cp2visibility]);

	const cp3visibility = layerVisibilities["ris-checkpoint-3"];
	const toggleCheckpoint3Visibility = React.useCallback(e => {
		setLayerVisibility("ris-checkpoint-3", cp3visibility === "visible" ? "none" : "visible");
	}, [maplibreMap, setLayerVisibility, cp3visibility]);

	const problemTMCsVisibility = layerVisibilities["problem-ris"];
	const toggleProblemTMCsVisibility = React.useCallback(e => {
		setLayerVisibility("problem-ris", problemTMCsVisibility === "visible" ? "none" : "visible");
	}, [maplibreMap, setLayerVisibility, problemTMCsVisibility]);

	return (
		<div className="w-fit grid grid-cols-1 gap-2 mb-2">

			<button onClick={ toggleCheckpoint2Visibility }
				className={ `
					py-3 px-4 rounded-lg pointer-events-auto
					bg-gray-100 hover:bg-gray-400 cursor-pointer
					flex items-center w-full
				` }
			>
				<span className={ cp2visibility === "none" ?
									"fa fa-eye-slash text-2xl" :
									"fa fa-eye text-2xl" }/>
				<span className="ml-8 flex-1 text-right font-bold">
					{ cp2visibility === "none" ? "Show " : "Hide " }
					RIS Checkpoint 2
				</span>
			</button>

			<button onClick={ toggleCheckpoint3Visibility }
				className={ `
					py-3 px-4 rounded-lg pointer-events-auto
					bg-gray-100 hover:bg-gray-400 cursor-pointer
					flex items-center w-full
				` }
			>
				<span className={ cp3visibility === "none" ?
									"fa fa-eye-slash text-2xl" :
									"fa fa-eye text-2xl" }/>
				<span className="ml-8 flex-1 text-right font-bold">
					{ cp3visibility === "none" ? "Show " : "Hide " }
					RIS Checkpoint 3
				</span>
			</button>

			<button onClick={ toggleProblemTMCsVisibility }
				className={ `
					py-3 px-4 rounded-lg pointer-events-auto
					bg-gray-100 hover:bg-gray-400 cursor-pointer
					flex items-center w-full
				` }
			>
				<span className={ problemTMCsVisibility === "none" ?
									"fa fa-eye-slash text-2xl" :
									"fa fa-eye text-2xl" }/>
				<span className="ml-8 flex-1 text-right font-bold">
					{ problemTMCsVisibility === "none" ? "Show " : "Hide " }
					Problem RIS
				</span>
			</button>

		</div>
	);
}

export default RenderComponent;