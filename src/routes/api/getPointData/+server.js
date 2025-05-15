export async function GET({ fetch }) {
	const result = await fetch('https://hushmap-backend.reofficial.dev/geojson/points');
	const data = await result.json();

	return new Response(JSON.stringify(data), {
		headers: {
			'Content-Type': 'application/json',
		}
	}
	)
}
