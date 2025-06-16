import { google } from "googleapis";
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSession } from "@/components/hero-session"

export default async function Page({ params }) {
    const { id } = params;
    // Auth
    const auth = await google.auth.getClient({
        scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    })
    const sheets = google.sheets({ version: 'v4', auth })

    const range = `'Accepted'!A${id}:Z${id}`
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SHEET_ID,
        range
    })
    //console.log({ response });
    var headings = [
        "Title",
        "Type",
        "Date",
        "Time",
        "Who",
        "Image",
        "Description"
    ]
    var rows = response.data.values
    let row = rows[0];
    let title = row[0];
    let type = row[1] || null;
    let date = row[2] || null;
    let startTime = row[3] || null;
    let endTime = row[4] || null;
    let who = row[5] || null;
    let image = row[6] || null;
    let description = row[7] || null;
    let Row = ({ row, rowIndex }) => {
        return <tr>
            {row.map(function (cell, cellIndex) {
                return <td key={`row-${rowIndex}-cell-${cellIndex}`}>{cell}</td>
            })}
        </tr>
    }

    console.log({ headings, rows })
    return <>
        <div className="min-h-screen bg-background">
            <Header />
            <main>
                <HeroSession
                    title={title}
                    type={type}
                    date={date}
                    startTime={startTime}
                    endTime={endTime}
                    who={who}
                    image={image}
                    description={description}
                />
            </main>
            <Footer />
        </div>
    </>
}