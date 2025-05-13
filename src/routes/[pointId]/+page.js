export async function load({ fetch, params }) {
	async function fetchPointData(pointId) {
		const res = await fetch(`https://hushmap-backend.reofficial.dev/points/${pointId}`)
		const data = await res.json()
		return data
	}
	return {
		sessionsInfo: await fetchPointData(params.pointId)
	}
}
