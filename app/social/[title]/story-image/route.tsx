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
  { params }: { params: Promise<{ title: string }> }
) {
  try {
    const { title } = await params
    
    // Get session data from our API route
    const baseUrl = new URL(request.url).origin
    const response = await fetch(`${baseUrl}/api/sessions`)
    
    if (!response.ok) {
      return new Response('Failed to fetch session data', { status: 500 })
    }
    
    const sheet = await response.json()
    
    // Find session by title (URL decoded and matched)
    const decodedTitle = decodeURIComponent(title).replace(/-/g, ' ')
    console.log('Looking for session with title:', decodedTitle)
    const sessionData = sheet.filter((event: any) => {
      const sessionTitle = event.title.toLowerCase()
      const searchTitle = decodedTitle.toLowerCase()
      // Try exact match first, then contains match
      return sessionTitle === searchTitle || 
             sessionTitle.includes(searchTitle) || 
             searchTitle.includes(sessionTitle) ||
             // Try word-by-word matching for better results
             searchTitle.split(' ').every(word => sessionTitle.includes(word))
    })
    
    console.log(`Found ${sessionData.length} matching sessions for "${decodedTitle}"`)
    
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
            justifyContent: 'flex-start',
            backgroundColor: '#12100e',
            backgroundImage: 'linear-gradient(135deg, #12100e 0%, #1e1c18 50%, #12100e 100%)',
            padding: '20px 40px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Header with Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              marginBottom: '-150px',
              marginTop: '-250px',
            }}
          >
            {logoDataUrl && (
              <img
                src={logoDataUrl}
                alt="nullEDGE"
                style={{
                  width: '650px',
                  height: '650px',
                  objectFit: 'contain',
                }}
              />
            )}
            {!logoDataUrl && (
              <div
                style={{
                  width: '650px',
                  height: '650px',
                  backgroundColor: '#4f46e5',
                  borderRadius: '65px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '104px',
                  textAlign: 'center',
                }}
              >
                LOGO
              </div>
            )}
          </div>
          
          {/* Main Content Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              maxWidth: '100%',
              width: '100%'
            }}
          >
            {/* Session Title */}
            <h1
              style={{
                fontSize: session.title.length > 60 ? '36px' : session.title.length > 30 ? '44px' : '52px',
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
                  gap: speakerImageDataUrls.length > 1 ? '20px' : '15px',
                  marginBottom: '30px',
                  flexWrap: 'wrap',
                  maxWidth: speakerImageDataUrls.length > 1 ? '880px' : '600px',
                }}
              >
                {speakerImageDataUrls.slice(0, 4).map((imageUrl, index) => (
                  imageUrl ? (
                    <img
                      key={index}
                      src={imageUrl}
                      alt={speakerNames[index]}
                      style={{
                        width: speakerImageDataUrls.length > 1 ? '400px' : '600px',
                        height: speakerImageDataUrls.length > 1 ? '400px' : '600px',
                        borderRadius: speakerImageDataUrls.length > 1 ? '60px' : '80px',
                        border: speakerImageDataUrls.length > 1 ? '12px solid white' : '16px solid white',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      key={index}
                      style={{
                        width: speakerImageDataUrls.length > 1 ? '400px' : '600px',
                        height: speakerImageDataUrls.length > 1 ? '400px' : '600px',
                        borderRadius: speakerImageDataUrls.length > 1 ? '60px' : '80px',
                        border: speakerImageDataUrls.length > 1 ? '12px solid white' : '16px solid white',
                        backgroundColor: '#4f46e5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: speakerImageDataUrls.length > 1 ? '160px' : '240px',
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
                    fontSize: speakerNames.join(', ').length > 80 ? '20px' : speakerNames.join(', ').length > 50 ? '24px' : '28px',
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
          
          {/* Footer */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              marginTop: '20px',
            }}
          >
            <div
              style={{
                fontSize: '24px',
                color: '#94a3b8',
                textAlign: 'center',
                fontWeight: '500',
              }}
            >
              Join us @ thenulledge.com on October 17, 2025
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 1350,
      }
    )
  } catch (error) {
    console.error('Failed to generate story image:', error)
    return new Response(`Failed to generate image: ${error}`, { status: 500 })
  }
}