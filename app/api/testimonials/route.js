import { getTestimonials } from '../sheets';


export async function GET(request) {
  try {
    const data = await getTestimonials();
    return Response.json(data);
  } catch (error) {
    return Response.json({ error: 'Failed to load testimonials.' }, { status: 500 }); 
  }
}