import React from "react"

import * as turf from "@turf/turf";

const RIS_REGEX = /^\d+$/;

const RisSearchInfoBox = ({ layer, layerState, maplibreMap, ...props }) => {

	const [loading, setLoading] = React.useState(false);
	const [risBboxes, setRisBboxes] = React.useState(new Map());

  React.useEffect(() => {
  	setLoading(true);
    fetch("http://localhost:4444/ris-bboxes/npmrds2")
      .then(res => res.json())
      .then(json => {
      	if (json.ok) {
      		setRisBboxes(
      			json.result.rows.reduce((a, c) => {
      				a.set(c.ris_id, c.bbox);
      				return a;
      			}, new Map())
      		)
      	}
      }).then(() => setLoading(false))
  }, []);

	const selfLayerState = React.useMemo(() => {
		return layerState[layer.id];
	}, [layerState, layer.id]);

	const clickedProblemRIS = selfLayerState.clickedProblemRIS;

	const setFilteredRIS = React.useCallback(TMCs => {
		layer.updateState({ filteredRIS: [...TMCs] })
	}, [layer]);

	const [textareaValue, setTextareaValue] = React.useState("");

	React.useEffect(() => {
		if (!clickedProblemRIS) return;
		setTextareaValue(prev => {
			if (prev && !prev.includes(clickedProblemRIS)) {
				return `${ prev }\n${ clickedProblemRIS }`
			}
			else if (!prev) {
				return clickedProblemRIS;
			}
			return prev;
		})
	}, [clickedProblemRIS]);

	const clearRisSearch = React.useCallback(() => {
		setTextareaValue("");
	}, []);

	React.useEffect(() => {
		const RIS = textareaValue.replace(/[,|'"]/g, " ")
									.toUpperCase()
									.split(/\s+/g)
									.filter(v => RIS_REGEX.test(v));
		setFilteredRIS(RIS);
	}, [textareaValue, setFilteredRIS]);

	const doOnChange = React.useCallback(e => {
		setTextareaValue(e.target.value);
	}, []);

	const filteredRIS = React.useMemo(() => {
		return [...selfLayerState.filteredRIS];
	}, [selfLayerState.filteredRIS]);

	const [zoomTo, setZoomTo] = React.useState(null);

	React.useEffect(() => {
		if (zoomTo && risBboxes.has(zoomTo)) {
			const padding = {
				top: 150, bottom: 150, left: 200, right: 200
			}
			maplibreMap.fitBounds(risBboxes.get(zoomTo), { padding });
			setZoomTo(null);
		}
	}, [risBboxes, zoomTo]);

	return (
		<div className="relative">
			{ !loading ? null :
				<div
					className={ `
						inset-[0] absolute opacity-75 bg-black z-50 rounded
						text-white font-bold text-2xl
						flex items-center justify-center
					` }
				>
					LOADING...
				</div>
			}
			<textarea rows={ 5 }
				className="w-full p-2 border-1 rounded block outline-none"
				value={ textareaValue }
				onChange={ doOnChange }/>

			{	!filteredRIS.length ? null :
				<div className="grid grid-cols-1 gap-1 mt-1 max-h-80 overflow-auto">
					{	filteredRIS.map(ris_id => (
							<FilteredRIS key={ ris_id }
								ris_id={ ris_id }
								zoomTo={ setZoomTo }/>
						))
					}
				</div>
			}

			{	!filteredRIS.length ? null :
				<button onClick={ clearRisSearch }
					className={ `
						rounded w-full py-1 mt-1
						bg-gray-300 hover:bg-gray-400
						cursor-pointer
					` }
				>
					Clear RIS Search
				</button>
			}
		</div>
	)
}
export default RisSearchInfoBox;

const FilteredRIS = ({ ris_id, zoomTo }) => {
	const doZoomTo = React.useCallback(e => {
		zoomTo(ris_id);
	}, [zoomTo, ris_id]);
	return (
		<div className="flex items-center bg-gray-200 p-1 rounded">
			<div className="flex-1">{ ris_id }</div>
			<button onClick={ doZoomTo }
				className={ `
					rounded px-2 py-1 text-sm
					bg-gray-300 hover:bg-gray-400
					cursor-pointer
				` }
			>
				<div className="fa fa-magnifying-glass"/>
			</button>
		</div>
	)
}