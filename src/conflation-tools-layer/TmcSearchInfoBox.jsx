import React from "react"

import * as turf from "@turf/turf";

const TMC_REGEX = /^\d{3}[+-PNpn]\d{5}$/;

const TmcSearchInfoBox = ({ layer, layerState, maplibreMap, ...props }) => {

	const [tmcBboxes, setTmcBboxes] = React.useState(new Map());

  React.useEffect(() => {
    fetch("http://localhost:4444/tmc-bboxes/npmrds2")
      .then(res => res.json())
      .then(json => {
      	if (json.ok) {
      		setTmcBboxes(
      			json.result.rows.reduce((a, c) => {
      				a.set(c.tmc, c.bbox);
      				return a;
      			}, new Map())
      		)
      	}
      })
  }, []);

	const selfLayerState = React.useMemo(() => {
		return layerState[layer.id];
	}, [layerState, layer.id]);

	const clickedProblemTMC = selfLayerState.clickedProblemTMC;

	const setFilteredTMCs = React.useCallback(TMCs => {
		layer.updateState({ filteredTMCs: [...TMCs] })
	}, [layer]);

	const [textareaValue, setTextareaValue] = React.useState("");

	React.useEffect(() => {
		if (!clickedProblemTMC) return;
		setTextareaValue(prev => {
			if (prev && !prev.includes(clickedProblemTMC)) {
				return `${ prev }\n${ clickedProblemTMC }`
			}
			else if (!prev) {
				return clickedProblemTMC;
			}
		})
	}, [clickedProblemTMC]);

	const clearTmcSearch = React.useCallback(() => {
		setTextareaValue("");
	}, []);

	React.useEffect(() => {
		const TMCs = textareaValue.replace(/[,|'"]/g, " ")
									.toUpperCase()
									.split(/\s+/g)
									.filter(v => TMC_REGEX.test(v));
		setFilteredTMCs(TMCs);
	}, [textareaValue, setFilteredTMCs]);

	const doOnChange = React.useCallback(e => {
		setTextareaValue(e.target.value);
	}, []);

	const filteredTMCs = React.useMemo(() => {
		return [...selfLayerState.filteredTMCs];
	}, [selfLayerState.filteredTMCs]);

	const [zoomTo, setZoomTo] = React.useState(null);

	React.useEffect(() => {
		if (zoomTo && tmcBboxes.has(zoomTo)) {
			const padding = {
				top: 150, bottom: 150, left: 200, right: 200
			}
			maplibreMap.fitBounds(tmcBboxes.get(zoomTo), { padding });
		}
	}, [tmcBboxes, zoomTo]);

	return (
		<div>
			<textarea rows={ 5 }
				className="w-full p-1 border-1 rounded block"
				value={ textareaValue }
				onChange={ doOnChange }/>

			{	!filteredTMCs.length ? null :
				<div className="grid grid-cols-1 gap-1 mt-1">
					{	filteredTMCs.map(tmc => (
							<FilteredTMC key={ tmc }
								tmc={ tmc }
								zoomTo={ setZoomTo }/>
						))
					}
				</div>
			}

			{	!filteredTMCs.length ? null :
				<button onClick={ clearTmcSearch }
					className={ `
						rounded w-full py-1 mt-1
						bg-gray-300 hover:bg-gray-400
						cursor-pointer
					` }
				>
					Clear TMC Search
				</button>
			}
		</div>
	)
}
export default TmcSearchInfoBox;

const FilteredTMC = ({ tmc, zoomTo }) => {
	const doZoomTo = React.useCallback(e => {
		zoomTo(tmc);
	}, [zoomTo, tmc]);
	return (
		<div className="flex items-center bg-gray-200 p-1 rounded">
			<div className="flex-1">{ tmc }</div>
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