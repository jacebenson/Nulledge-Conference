import { google } from "googleapis";

export async function getDataFromSheets() {
    try {
        const jwt = new google.auth.JWT({
            email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
            key: (process.env.GOOGLE_SHEETS_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
            scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"]
        })

        const sheets = google.sheets({ version: "v4", auth: jwt });
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.SPREADSHEET_ID,
            range: process.env.SPREADSHEET_NAME,
        });

        const rows = response.data.values;
        if (rows.length) {
            return rows.map((row) => ({
                title: row[0],
                type: row[1],
                date: row[2],
                startTime: row[3],
                endTime: row[4],
                image: row[5],
                description: row[6],
                speakers: row[7],
                speakersTitles: row[8],
                speakersImages: row[9],
                speakersURLs: row[10],
                speakersEmployers: row[11],
                speakersEmployerURLs: row[12],
                speakersEmployerImages: row[13],
                featured: row[14]
            }));
        }
    } catch (err) {
        console.log(err);
    }

    return [];
}

export async function getDataFromRingCentral() {
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
                const startTimeStr = startDate.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                });
                const endTimeStr = endDate.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                });
                
                return {
                    title: item.name || '',
                    type: item.event_part_type || '',
                    date: dateStr,
                    startTime: startTimeStr,
                    endTime: endTimeStr,
                    image: item.speakers && item.speakers.length > 0 ? item.speakers[0].picture_url : '',
                    description: item.description || '',
                    speakers: item.speakers ? item.speakers.map(s => s.name).join(', ') : '',
                    speakersTitles: item.speakers ? item.speakers.map(s => s.headline || '').join(', ') : '',
                    speakersImages: item.speakers ? item.speakers.map(s => s.picture_url || '').join(', ') : '',
                    speakersURLs: item.speakers ? item.speakers.map(s => s.website || '').join(', ') : '',
                    speakersEmployers: item.speakers ? item.speakers.map(s => s.headline || '').join(', ') : '',
                    speakersEmployerURLs: item.speakers ? item.speakers.map(s => s.linkedin || '').join(', ') : '',
                    speakersEmployerImages: item.speakers ? item.speakers.map(s => s.thumb_picture_url || '').join(', ') : '',
                    featured: item.tags && item.tags.some(tag => tag.name === 'Keynote') || false
                };
            });
        }
    } catch (error) {
        console.error('Error fetching data from RingCentral:', error);
    }

    return [];
}