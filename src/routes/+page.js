export async function load({ fetch }) {
	async function fetchPointData() {
		const result = await fetch('https://hushmap-backend.reofficial.dev/geojson/points')
		const points = await result.json()
		return points
	}

	return {
		points: await fetchPointData()
	}
}
