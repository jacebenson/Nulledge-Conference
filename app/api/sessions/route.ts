import { getDataFromRingCentral } from '@/app/api/sheets'

export async function GET() {
  try {
    const data = await getDataFromRingCentral()
    return Response.json(data)
  } catch (error) {
    console.error('Failed to fetch session data:', error)
    return Response.json({ error: 'Failed to fetch session data' }, { status: 500 })
  }
}