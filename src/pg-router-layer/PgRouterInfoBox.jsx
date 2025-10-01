import React from "react"

import { scaleLinear } from "d3-scale"

import maplibre from "maplibre-gl"

const PgRouterInfoBox = ({ layer, layerState, maplibreMap }) => {
	const clickedPoint = layerState[layer.id].clickedPoint;

	const [points, setPoints] = React.useState([]);
	const [loading, setLoading] = React.useState(false);

	const removeAllPoints = React.useCallback(() => {
		setPoints(points => {
			points.forEach(({ marker }) => {
				marker.remove();
			});
			return [];
		});
	}, []);

	const removePoint = React.useCallback(cid => {
		setPoints(points => {
			return points.reduce((a, c) => {
				if (c.cid !== cid) {
					a.push({ ...c, marker: null, point: c.marker.getLngLat() });
				}
				c.marker.remove();
				return a;
			}, [])
		});
	}, []);

	const colorScale = React.useMemo(() => {
		return scaleLinear()
				.domain([0, (points.length - 1) * 0.5, points.length - 1])
				.range(["#1a9850", "#ffffbf", "#d73027" ]);
	}, [points.length]);

	React.useEffect(() => {
		if (loading) return;
		if (!clickedPoint) return;

		const { lng, lat } = clickedPoint;

		const cid = `${ lng }-${ lat }`;

		const pointsMap = points.reduce((a, c) => {
			const { cid } = c;
			a[cid] = c;
			return a;
		}, {});

		if (!(cid in pointsMap)) {
			setPoints([
				...points,
				{ cid, point: { lng, lat }, marker: null }
			])
		}
		setPoints(point => {
			const { lng, lat } = clickedPoint;
			const cid = `${ lng }-${ lat }`;
			const pointsMap = points.reduce((a, c) => {
				const { cid } = c;
				a[cid] = c;
				return a;
			}, {});
			if (!(cid in pointsMap)) {
				return [
					...points,
					{ cid, point: { lng, lat }, marker: null }
				]
			}
			else {
				return points
			}
		})
	}, [clickedPoint, loading]);

	React.useEffect(() => {
		const hasNewPoint = points.reduce((a, c) => {
			return a || Boolean(c.point);
		}, false);

		if (hasNewPoint) {
										// THERE IS ONLY EVER A MARKER OR A POINT
			const mapped = points.map(({ cid, point, marker }, i) => {
				if (marker) {
					point = marker.getLngLat();
					marker.remove();
				}
				marker = new maplibre.Marker({ draggable: true, color: colorScale(i) })
											.setLngLat(point)
											.addTo(maplibreMap);
				return { cid, marker };
			})
			setPoints(mapped);
		}
	}, [points, colorScale]);

	const sendRequest = React.useCallback(() => {
		const coords = points.map(({ marker }) => {
			const { lng, lat } = marker.getLngLat();
			return [lng, lat];
		});
		setLoading(true);
		fetch("http://localhost:4444/pgrouter/npmrds2",
			{	method: "POST",
				body: JSON.stringify({ coords })
			}
		).then(res => res.json())
			.then(json => {
				console.log("RES:", json)
				if (json.ok) {
					maplibreMap.getSource("path-nodes-source")
						.setData(json.result.pointCollection);

					maplibreMap.getSource("path-source")
						.setData(json.result.pathFeature);
				}
			})
			.catch(e => {
				console.error(e);
			})
			.finally(() => {
				setLoading(false);
			});
	}, [points, maplibreMap]);

	const canSend = React.useMemo(() => {
		return !loading && (points.length > 1);
	}, [points, loading]);

	const clearPath = React.useCallback(() => {
		const emptyCollection = {
			type: "FeatureCollection",
			features: []
		}
		maplibreMap.getSource("path-nodes-source").setData(emptyCollection);
		maplibreMap.getSource("path-source").setData(emptyCollection);
	}, [maplibreMap]);

	const clearAll = React.useCallback(() => {
		removeAllPoints();
		clearPath();
	}, [removeAllPoints, clearPath]);

	return (
		<div className="text-sm relative">
			<div className="grid grid-cols-1 gap-1">
				{	points.filter(p => Boolean(p.marker))
						.map((p, i) => (
							<InfoBoxPoint key={ p.cid } { ...p }
								remove={ removePoint }
								bgColor={ colorScale(i) }/>
						))
				}

				<div>
					<button onClick={ sendRequest }
						disabled={ !canSend }
						className={	`
							w-full rounded py-3
							bg-green-300 hover:bg-green-400 disabled:bg-red-300
							cursor-pointer disabled:cursor-not-allowed
							disabled:opacity-50
						` }
					>
						Send PG Router Request
					</button>
				</div>

				<div className="grid grid-cols-3 gap-1">
					<button onClick={ removeAllPoints }
						className={	`
							w-full rounded py-1
							bg-gray-300 hover:bg-gray-400 disabled:bg-gray-300
							cursor-pointer disabled:cursor-not-allowed
							disabled:opacity-50
						` }
					>
						Clear Points
					</button>
					<button onClick={ clearPath }
						className={	`
							w-full rounded py-1
							bg-gray-300 hover:bg-gray-400 disabled:bg-gray-300
							cursor-pointer disabled:cursor-not-allowed
							disabled:opacity-50
						` }
					>
						Clear Path
					</button>
					<button onClick={ clearAll }
						className={	`
							w-full rounded py-1
							bg-gray-300 hover:bg-gray-400 disabled:bg-gray-300
							cursor-pointer disabled:cursor-not-allowed
							disabled:opacity-50
						` }
					>
						Clear All
					</button>
				</div>

			</div>
			{ !loading ? null :
				<div
					className={ `
						absolute inset-[-0.25rem]
						opacity-75 bg-black z-50
						flex items-center justify-center
						text-white text-3xl font-bold text-center
					` }
				>
					Request sent...<br />
					...Waiting for response...
				</div>
			}
		</div>
	)
}

export default PgRouterInfoBox;

const InfoBoxPoint = ({ marker, cid, remove, bgColor }) => {
	const doRemove = React.useCallback(() => {
		remove(cid);
	}, [remove, cid]);
	return (
		<div className="border-t-2 pt-1 grid grid-cols-6 px-1"
			style={ { backgroundColor: bgColor } }
		>
			<div className="col-span-5">
				<div>Lon: { marker.getLngLat().lng }</div>
				<div>Lat: { marker.getLngLat().lat }</div>
			</div>
			<div className="pt-1 pb-2 pr-1">
				<button onClick={ doRemove }
					className={ `
						w-full h-full cursor-pointer rounded
						text-red-300 hover:text-red-400 bg-gray-100
					` }
				>
					<span className="fa fa-trash"/>
				</button>
			</div>
		</div>
	)
}