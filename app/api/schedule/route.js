import { getDataFromSheets } from '../sheets';

export async function GET(request) {
  try {
    const data = await getDataFromSheets();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Failed to load schedule.' }, { status: 500 });
  }
}