import { getContributors } from '../sheets';


export async function GET(request) {
  try {
    const data = await getContributors();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Failed to load contributors.' }, { status: 500 }); 
  }
}