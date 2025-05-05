export const load = ( { fetch, params }) => {
	// fetch data for point X here
	const fetchPointData = async (pointId) => {
		const x = 2
		// const res = await fetch(`endpt`)
		// const data = await res.json()
		// return data
	}
	return {
		// point: fetchPointData(params.pointId)
		pointId: params.pointId
	}
}
