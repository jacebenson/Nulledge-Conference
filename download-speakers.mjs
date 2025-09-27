import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to fetch data from RingCentral API
async function getDataFromRingCentral() {
    try {
        const url = 'https://events.ringcentral.com/api/v2/schedules/public/nulledge/items';
        const options = { method: 'GET' };
        
        const response = await fetch(url, options);
        const data = await response.json();
        
        // Transform RingCentral data to match the expected format
        if (data && data.items) {
            return data.items.map((item) => {
                // Parse dates and times
                const startDate = new Date(item.time_start);
                const endDate = new Date(item.time_end);
                
                // Format date and time strings
                const dateStr = startDate.toLocaleDateString();
                const startTimeStr = startDate.toLocaleTimeString('en-us', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    timeZoneName: 'short',
                    hour12: true 
                });
                const endTimeStr = endDate.toLocaleTimeString('en-us', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    timeZoneName: 'short',
                    hour12: true 
                });
                
                return {
                    title: item.name || '',
                    type: item.event_part_type || '',
                    date: dateStr,
                    startTime: item.time_start || '',
                    endTime: item.time_end || '',
                    image: item.speakers && item.speakers.length > 0 ? item.speakers[0].picture_url : '',
                    description: item.description || '',
                    speakers: item.speakers ? item.speakers.map(s => s.name).join(', ') : '',
                    speakersTitles: item.speakers ? item.speakers.map(s => s.headline || '').join(', ') : '',
                    speakersImages: item.speakers ? item.speakers.map(s => s.picture_url || '').join(', ') : '',
                    speakersURLs: item.speakers ? item.speakers.map(s => s.website || '').join(', ') : '',
                    speakersEmployers: item.speakers ? item.speakers.map(s => s.headline || '').join(', ') : '',
                    speakersEmployerURLs: item.speakers ? item.speakers.map(s => s.linkedin || '').join(', ') : '',
                    speakersEmployerImages: item.speakers ? item.speakers.map(s => s.thumb_picture_url || '').join(', ') : '',
                    featured: item.tags && item.tags.some(tag => tag.name === 'Keynote') || false,
                    url: `https://events.ringcentral.com/event/${item.id}`,
                };
            });
        }
    } catch (error) {
        console.error('Error fetching data from RingCentral:', error);
    }

    return [];
}

// Function to create a slug from speaker name
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// Function to download an image
async function downloadImage(url, filepath) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filepath, buffer);
    console.log(`✅ Downloaded: ${path.basename(filepath)}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to download ${url}:`, error.message);
    return false;
  }
}

async function downloadAllSpeakerImages() {
  try {
    console.log('🔍 Fetching session data from RingCentral...');
    
    // Fetch session data directly from RingCentral API
    const sessions = await getDataFromRingCentral();
    console.log(`📊 Found ${sessions.length} sessions`);
    
    // Create speakers directory if it doesn't exist
    const speakersDir = path.join(__dirname, 'public', 'speakers');
    if (!fs.existsSync(speakersDir)) {
      fs.mkdirSync(speakersDir, { recursive: true });
      console.log('📁 Created speakers directory');
    }
    
    // Track downloaded images to avoid duplicates
    const downloadedImages = new Set();
    const speakerImageMap = {}; // Map original URL to local filename
    let totalDownloaded = 0;
    
    // Process each session
    for (const session of sessions) {
      if (!session.speakers || !session.speakersImages) {
        continue;
      }
      
      const speakerNames = session.speakers.split(', ').map(name => name.trim());
      const speakerImageUrls = session.speakersImages.split(', ').map(url => url.trim());
      
      // Process each speaker in this session
      for (let i = 0; i < speakerNames.length && i < speakerImageUrls.length; i++) {
        const speakerName = speakerNames[i];
        const imageUrl = speakerImageUrls[i];
        
        if (!imageUrl || !imageUrl.startsWith('http') || downloadedImages.has(imageUrl)) {
          continue;
        }
        
        // Create slugified filename
        const slug = slugify(speakerName);
        const filename = `${slug}.jpg`;
        const filepath = path.join(speakersDir, filename);
        
        console.log(`📥 Downloading: ${speakerName} → ${filename}`);
        
        // Download the image
        const success = await downloadImage(imageUrl, filepath);
        if (success) {
          downloadedImages.add(imageUrl);
          speakerImageMap[imageUrl] = filename;
          totalDownloaded++;
        }
        
        // Small delay to be nice to the server
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    // Create a mapping file for easy reference
    const mappingPath = path.join(speakersDir, 'image-mapping.json');
    fs.writeFileSync(mappingPath, JSON.stringify(speakerImageMap, null, 2));
    
    console.log(`\n🎉 Download complete!`);
    console.log(`📁 Downloaded ${totalDownloaded} speaker images`);
    console.log(`🗺️  Created mapping file: ${mappingPath}`);
    console.log(`📂 Images saved to: ${speakersDir}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
downloadAllSpeakerImages();