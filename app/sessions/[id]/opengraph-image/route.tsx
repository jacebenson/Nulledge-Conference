import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// Function to create a slug from speaker name (matches the download script)
function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// Function to load local speaker images
async function loadSpeakerImages(speakerNames: string[], baseUrl: string) {
  const speakerImagePromises = speakerNames.slice(0, 4).map(async (speakerName: string) => {
    try {
      const slug = slugify(speakerName);
      const imageUrl = `${baseUrl}/speakers/${slug}.jpg`;
      const response = await fetch(imageUrl);
      
      if (response.ok) {
        const buffer = await response.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        return `data:image/jpeg;base64,${base64}`;
      }
      return null;
    } catch (error) {
      console.error(`Failed to load speaker image for ${speakerName}:`, error);
      return null;
    }
  });
  
  return await Promise.all(speakerImagePromises);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Get session data from our API route
    const baseUrl = new URL(request.url).origin
    const response = await fetch(`${baseUrl}/api/sessions`)
    
    if (!response.ok) {
      return new Response('Failed to fetch session data', { status: 500 })
    }
    
    const sheet = await response.json()
    const sessionData = sheet.filter((event: any, index: number) => {
      return index === parseInt(id, 10) - 1
    })
    
    if (sessionData.length === 0) {
      return new Response('Session not found', { status: 404 })
    }
    
    const session = sessionData[0]
    const speakerNames = session.speakers ? session.speakers.split(', ') : []
    
    // Load the nullEDGE logo
    let logoDataUrl = null
    try {
      console.log('Attempting to load logo from:', `${baseUrl}/nullEDGElogo.jpg`)
      const logoResponse = await fetch(`${baseUrl}/nullEDGElogo.jpg`)
      console.log('Logo response status:', logoResponse.status)
      if (logoResponse.ok) {
        const logoBuffer = await logoResponse.arrayBuffer()
        const logoBase64 = Buffer.from(logoBuffer).toString('base64')
        logoDataUrl = `data:image/jpeg;base64,${logoBase64}`
        console.log('Logo loaded successfully, data URL length:', logoDataUrl.length)
      } else {
        console.log('Logo response not OK:', logoResponse.status, logoResponse.statusText)
      }
    } catch (error) {
      console.error('Failed to load logo:', error)
    }
    
    // Load local speaker images
    const speakerImageDataUrls = await loadSpeakerImages(speakerNames, baseUrl)
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#12100e',
            backgroundImage: 'linear-gradient(135deg, #12100e 0%, #1e1c18 50%, #12100e 100%)',
            padding: '60px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              left: '40px',
              display: 'flex',
              alignItems: 'center',
              gap: '20px',
            }}
          >
          </div>
          
          {/* Main Content Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '1200px',
              width: '100%',
              transform: 'translateY(-60px)',
            }}
          >
            {/* Session Title */}
            <h1
              style={{
                fontSize: session.title.length > 60 ? '48px' : session.title.length > 30 ? '56px' : '64px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 0 40px 0',
                lineHeight: '1.1',
                textAlign: 'center',
                maxWidth: '100%',
              }}
            >
              {session.title}
            </h1>
            
            {/* Speaker Images */}
            {speakerImageDataUrls.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '20px',
                  marginBottom: '30px',
                  flexWrap: 'wrap',
                }}
              >
                {speakerImageDataUrls.map((imageUrl, index) => (
                  imageUrl ? (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={speakerNames[index]}
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '60px',
                        border: '4px solid white',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      key={index}
                      style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '60px',
                        border: '4px solid white',
                        backgroundColor: '#4f46e5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '48px',
                        color: 'white',
                        fontWeight: 'bold',
                      }}
                    >
                      👤
                    </div>
                  )
                ))}
              </div>
            )}
            
            {/* Speaker Names */}
            {speakerNames.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <p
                  style={{
                    fontSize: speakerNames.join(', ').length > 80 ? '24px' : speakerNames.join(', ').length > 50 ? '28px' : '32px',
                    color: '#e2e8f0',
                    margin: '0',
                    fontWeight: '500',
                    textAlign: 'center',
                    maxWidth: '100%',
                  }}
                >
                  {speakerNames.join(', ')}
                </p>
              </div>
            )}
          </div>
          
          {/* Footer with Logo */}
          <div
            style={{
              position: 'absolute',
              bottom: '-190px',
              left: '55%',
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '700px',
            }}
          >
            {logoDataUrl && (
              <img
                src={logoDataUrl}
                alt="nullEDGE"
                style={{
                  width: '600px',
                  height: '600px',
                  objectFit: 'contain',
                }}
              />
            )}
            {!logoDataUrl && (
              <div
                style={{
                  width: '600px',
                  height: '600px',
                  backgroundColor: '#4f46e5',
                  borderRadius: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '48px',
                  textAlign: 'center',
                }}
              >
                LOGO
              </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1500,
        height: 625,
      }
    )
  } catch (error) {
    console.error('Failed to generate OG image:', error)
    return new Response(`Failed to generate image: ${error}`, { status: 500 })
  }
}