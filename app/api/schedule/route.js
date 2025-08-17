import { getDataFromRingCentral } from '../sheets';

export async function GET(request) {
  try {
    const data = await getDataFromRingCentral();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Failed to load schedule.' }, { status: 500 });
  }
}