# Product Description
This is a Next.js project for the Nulledge website (thenulledge.com). It is designed to be a landing page for the Nulledge conference, which focuses on practical knowledge sharing in the platform community. The site includes sections for speakers, schedule, and other conference-related information.

It's a Typescript/Javascript project.

This uses RingCentral's public endpoints for sessions and speakers, and it is set up to use a Google Sheet for some content on the home page. The project uses Tailwind CSS for styling and layout.

## Project Structure

- README.md: Project documentation.  This should be updated with an overview of the project, how to run it, and any other relevant information.
- CHANGELOG.md: A log of changes made to the project.
- `./app`: Contains the main application code, including pages.
- `./components`: Contains reusable components used throughout the application.
- `./public`: Contains static assets like images and icons.

## Image Generation System

The project includes a comprehensive dynamic image generation system for social media and OpenGraph images:

### Features
- **Dynamic OpenGraph Images**: Auto-generated OG images for session pages (`/sessions/[id]/opengraph-image`)
- **Social Media Images**: Dedicated social story images for sharing (`/social/[title]/story-image`)
- **Speaker Image Integration**: Downloads and processes speaker photos from RingCentral API
- **Social Media Gallery**: Browse and preview all generated images at `/social`

### Key Components
- `app/sessions/[id]/opengraph-image/route.tsx`: Generates OG images for individual sessions
- `app/social/[title]/story-image/route.tsx`: Creates social media story images with custom branding
- `app/social/page.tsx`: Gallery page showing all available social images
- `download-speakers.mjs`: Script to download speaker images from RingCentral API
- `public/speakers/`: Directory containing downloaded speaker images

### Technical Details
- Uses Next.js `@vercel/og` (ImageResponse) for server-side image generation
- Edge runtime for optimal performance
- Dynamic speaker image loading with base64 encoding
- Consistent slugification for speaker image filenames
- Automatic fallbacks for missing speaker images
- Brand-consistent styling with nullEDGE logo and colors

### Usage
- OpenGraph images are automatically generated for session pages
- Social images can be accessed at `/social/[session-title-slug]/story-image`
- Run `node download-speakers.mjs` to update speaker images from RingCentral
- All images are generated on-demand and cached by Vercel/Next.js

## Project guidelines
- Use Next.js conventions for naming and structuring files.
- Follow RESTful principles for API routes.
- Use components for reusable UI elements.
- Keep pages thin and move business logic to hooks or utility functions
- Use Tailwind CSS for styling and layout.
