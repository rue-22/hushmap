export async function GET({ fetch, params }) {
	const { pointId } = params;
	const result = await fetch(`https://hushmap-backend.reofficial.dev/points/${pointId}`)
	const data = await result.json()

	return new Response(JSON.stringify(data), {
		headers: {
			'Content-Type': 'application/json',
		}
	})
}
