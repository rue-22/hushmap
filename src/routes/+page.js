export async function load({ fetch }) {
	async function fetchPointData() {
		const result = await fetch('/api/getPointData')
		const points = await result.json()
		return points
	}

	return {
		points: await fetchPointData()
	}
}
