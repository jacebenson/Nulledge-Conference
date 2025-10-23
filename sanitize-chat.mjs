#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Columns to keep (by index in the original CSV)
const COLUMNS_TO_KEEP = {
  'Time': 0,
  'First Name': 2,
  'Last Name': 3,
  'Headline': 4,
  'Country/Region': 5,
  'Ticket Type': 6,
  'Level': 7,
  'Text': 8,
  'Reaction Count': 9,
  'Bio': 11,
  'Website': 12,
  'Linkedin': 13, // Will merge with LinkedIn profile (index 19)
  'X': 14,
  'Company/Organization': 16
};

// Columns to remove (PII and unnecessary data)
const COLUMNS_TO_REMOVE = [
  'Email',
  'Custom Form Completed',
  'What is your primary role?',
  'How do you engage with ServiceNow?',
  'LinkedIn profile', // Will be merged with Linkedin column
  'Schedule Segment' // Not needed for chat display
];

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

function escapeCSVField(field) {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

function sanitizeChatFile(filePath) {
  console.log(`Processing: ${path.basename(filePath)}`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    
    if (lines.length === 0) {
      console.log(`  Skipped: Empty file`);
      return;
    }
    
    // Parse header to get column indices
    const headers = parseCSVLine(lines[0]);
    const keepIndices = Object.values(COLUMNS_TO_KEEP);
    const newHeaders = Object.keys(COLUMNS_TO_KEEP);
    
    console.log(`  Original columns: ${headers.length}`);
    console.log(`  Keeping columns: ${keepIndices.length}`);
    
    // Process all lines
    const sanitizedLines = [];
    
    // Add new header
    sanitizedLines.push(newHeaders.map(escapeCSVField).join(','));
    
    // Process data lines
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      try {
        const fields = parseCSVLine(line);
        const sanitizedFields = keepIndices.map(index => {
          let value = fields[index] || '';
          
          // Special handling for LinkedIn: merge Linkedin (index 13) and LinkedIn profile (index 19)
          if (index === 13) {
            const linkedinField = fields[13] || '';
            const linkedinProfileField = fields[19] || '';
            
            // Use whichever one has a value, prefer the first one if both have values
            if (linkedinField && linkedinField.trim()) {
              value = linkedinField.trim();
            } else if (linkedinProfileField && linkedinProfileField.trim()) {
              value = linkedinProfileField.trim();
            } else {
              value = '';
            }
          }
          
          return value;
        });
        
        sanitizedLines.push(sanitizedFields.map(escapeCSVField).join(','));
      } catch (error) {
        console.log(`  Warning: Could not parse line ${i}: ${error.message}`);
      }
    }
    
    // Write sanitized file
    const sanitizedContent = sanitizedLines.join('\n');
    fs.writeFileSync(filePath, sanitizedContent, 'utf-8');
    
    console.log(`  ✓ Sanitized ${sanitizedLines.length - 1} message records`);
    
  } catch (error) {
    console.error(`  ✗ Error processing ${filePath}: ${error.message}`);
  }
}

function sanitizeAllChatFiles() {
  const chatDir = path.join(__dirname, 'app', 'conference', '2025', 'chat');
  
  if (!fs.existsSync(chatDir)) {
    console.error(`Chat directory not found: ${chatDir}`);
    process.exit(1);
  }
  
  console.log(`Sanitizing chat files in: ${chatDir}\n`);
  
  const files = fs.readdirSync(chatDir)
    .filter(file => file.endsWith('.csv'))
    .sort();
  
  if (files.length === 0) {
    console.log('No CSV files found to process.');
    return;
  }
  
  console.log(`Found ${files.length} CSV files to process:\n`);
  
  files.forEach(file => {
    const filePath = path.join(chatDir, file);
    sanitizeChatFile(filePath);
  });
  
  console.log(`\n✓ Completed sanitization of ${files.length} files`);
  console.log('\nRemoved columns:');
  COLUMNS_TO_REMOVE.forEach(col => console.log(`  - ${col}`));
}

// Run the sanitization
sanitizeAllChatFiles();