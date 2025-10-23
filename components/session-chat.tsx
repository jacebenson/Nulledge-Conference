'use client';

import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Heart, User, Clock } from "lucide-react";

interface ChatMessage {
  time: string;
  email: string;
  firstName: string;
  lastName: string;
  headline: string;
  countryRegion: string;
  ticketType: string;
  level: string;
  text: string;
  reactionCount: number;
  scheduleSegment: string;
  bio: string;
  website: string;
  linkedin: string;
  x: string;
  customFormCompleted: string;
  companyOrganization: string;
  primaryRole: string;
  engageWithServiceNow: string;
  linkedinProfile: string;
}

interface SessionChatProps {
  sessionTitle?: string;
  chatFile?: string;
  className?: string;
}

export function SessionChat({ sessionTitle, chatFile, className = "" }: SessionChatProps) {
  const [sessionMessages, setSessionMessages] = useState<ChatMessage[]>([]);
  const [eventMessages, setEventMessages] = useState<ChatMessage[]>([]);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [eventLoading, setEventLoading] = useState(true);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [eventError, setEventError] = useState<string | null>(null);

  // Load session-specific chat
  useEffect(() => {
    const loadSessionChatData = async () => {
      try {
        setSessionLoading(true);
        setSessionError(null);

        let chatFileName: string;
        
        if (chatFile) {
          // Use the provided chat file path, extract just the filename
          chatFileName = chatFile.replace('./chat/', '');
        } else if (sessionTitle) {
          // Fallback: construct from session title
          chatFileName = `Session '${sessionTitle}' chat.csv`;
        } else {
          throw new Error('No chat file or session title provided');
        }

        const response = await fetch(`/api/chat/${encodeURIComponent(chatFileName)}?t=${Date.now()}`);
        
        if (!response.ok) {
          // If exact match fails, log the attempted filename for debugging
          console.log(`Chat file not found: ${chatFileName}`);
          throw new Error(`Chat not available for this session`);
        }

        const csvText = await response.text();
        const parsedMessages = parseCsvData(csvText);
        setSessionMessages(parsedMessages);
      } catch (err) {
        console.error('Error loading session chat:', err);
        setSessionError(err instanceof Error ? err.message : 'Failed to load session chat data');
      } finally {
        setSessionLoading(false);
      }
    };

    if (chatFile || sessionTitle) {
      loadSessionChatData();
    }
  }, [chatFile, sessionTitle]);

  // Load event chat
  useEffect(() => {
    const loadEventChatData = async () => {
      try {
        setEventLoading(true);
        setEventError(null);

        const response = await fetch(`/api/chat/${encodeURIComponent('Event chat.csv')}?t=${Date.now()}`);
        
        if (!response.ok) {
          throw new Error(`Event chat not available`);
        }

        const csvText = await response.text();
        const parsedMessages = parseCsvData(csvText);
        setEventMessages(parsedMessages);
      } catch (err) {
        console.error('Error loading event chat:', err);
        setEventError(err instanceof Error ? err.message : 'Failed to load event chat data');
      } finally {
        setEventLoading(false);
      }
    };

    loadEventChatData();
  }, []);

  const parseCsvData = (csvText: string): ChatMessage[] => {
    const lines = csvText.split('\n');
    
    return lines.slice(1)
      .filter(line => line.trim())
      .map((line, index) => {
        // Parse the new sanitized CSV format
        const values = parseCSVLine(line);
        
        // Debug logging for problematic parsing
        if (values.length < 14) {
          console.warn(`CSV line ${index + 1} has insufficient columns:`, values);
        }
        
        // New column order: Time,First Name,Last Name,Headline,Country/Region,Ticket Type,Level,Text,Reaction Count,Bio,Website,Linkedin,X,Company/Organization
        const message = {
          time: values[0] || '',
          email: '', // Removed in sanitization
          firstName: values[1] || '',
          lastName: values[2] || '',
          headline: values[3] || '',
          countryRegion: values[4] || '',
          ticketType: values[5] || '',
          level: values[6] || '',
          text: values[7] || '',
          reactionCount: parseInt(values[8]) || 0,
          scheduleSegment: '', // Removed in sanitization
          bio: values[9] || '',
          website: values[10] || '',
          linkedin: values[11] || '',
          x: values[12] || '',
          customFormCompleted: '', // Removed in sanitization
          companyOrganization: values[13] || '',
          primaryRole: '', // Removed in sanitization
          engageWithServiceNow: '', // Removed in sanitization
          linkedinProfile: '', // Removed in sanitization
        };
        
        // Debug: Check if names are missing and what's in the values
        if (!message.firstName && !message.lastName && values.length > 0) {
          console.warn(`Missing names on line ${index + 1}:`, values);
        }
        
        return message;
      })
      .filter(message => message.text.trim()) // Filter out empty messages
      .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()); // Sort by time
  };

  // Robust CSV line parser that handles quoted fields and various edge cases
  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    let i = 0;
    
    // Trim any BOM or whitespace from the line
    line = line.replace(/^\uFEFF/, '').trim();
    
    while (i < line.length) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote inside quoted field
          current += '"';
          i += 2; // Skip both quotes
          continue;
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator outside quotes
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
      
      i++;
    }
    
    // Add the last field
    result.push(current.trim());
    
    // Remove quotes from fields that are entirely quoted
    return result.map(field => {
      if (field.startsWith('"') && field.endsWith('"') && field.length > 1) {
        return field.slice(1, -1);
      }
      return field;
    });
  };

  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return timeString;
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'top':
        return 'bg-blue-100 text-blue-800';
      case 'reply':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const extractGiphyId = (url: string): string | null => {
    const giphyMatch = url.match(/giphy\.com\/gifs\/[^/]*-([A-Za-z0-9]+)$/);
    return giphyMatch ? giphyMatch[1] : null;
  };

  const renderMessageContent = (text: string) => {
    // Check if the message contains a Giphy URL
    const giphyRegex = /(https?:\/\/giphy\.com\/gifs\/[^\s]+)/g;
    const parts = text.split(giphyRegex);
    
    return parts.map((part, index) => {
      if (part.match(giphyRegex)) {
        const giphyId = extractGiphyId(part);
        if (giphyId) {
          return (
            <div key={index} className="mt-2 mb-2">
              <img
                src={`https://media.giphy.com/media/${giphyId}/giphy.gif`}
                alt="GIF"
                className="max-w-xs rounded border"
                loading="lazy"
                onError={(e) => {
                  // Fallback: show the original link if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const link = document.createElement('a');
                  link.href = part;
                  link.textContent = part;
                  link.className = 'text-blue-600 hover:text-blue-800 text-xs';
                  link.target = '_blank';
                  link.rel = 'noopener noreferrer';
                  target.parentNode?.appendChild(link);
                }}
              />
            </div>
          );
        }
      }
      // Return text parts as-is
      return part && <span key={index}>{part}</span>;
    });
  };

  const renderChatMessages = (messages: ChatMessage[], loading: boolean, error: string | null, emptyMessage: string) => {
    if (loading) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading chat messages...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-2">Unable to load chat messages</p>
            <p className="text-sm text-red-500">{error}</p>
          </div>
        </div>
      );
    }

    if (messages.length === 0) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">{emptyMessage}</p>
          </div>
        </div>
      );
    }

    return (
      <ScrollArea className="h-full px-4">
        <div className="space-y-1 py-2">
          {messages.map((message, index) => (
              <div key={index} className="text-sm break-words leading-relaxed flex items-start">
                <div className="w-64 flex-shrink-0 pr-2 text-right whitespace-nowrap">
                  {message.linkedin ? (
                    <a
                      href={message.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium cursor-help text-blue-600 hover:text-blue-800 no-underline"
                      title={`${message.headline ? message.headline + ' - ' : ''}${message.companyOrganization || ''}`}
                    >
                      {(message.firstName || message.lastName) ? 
                        `${message.firstName} ${message.lastName}`.trim() : 
                        'Unknown User'
                      }
                    </a>
                  ) : (
                    <span
                      className="font-medium cursor-help"
                      title={`${message.headline ? message.headline + ' - ' : ''}${message.companyOrganization || ''}`}
                    >
                      {(message.firstName || message.lastName) ? 
                        `${message.firstName} ${message.lastName}`.trim() : 
                        'Unknown User'
                      }
                    </span>
                  )}
                  
                  <span className="text-muted-foreground mx-1">@</span>
                  
                  <span className="text-xs text-muted-foreground">
                    {formatTime(message.time)}:
                  </span>
                </div>
                
                <div className="flex-1 min-w-0">
                  {renderMessageContent(message.text)}
                  
                  {message.reactionCount > 0 && (
                    <span className="ml-2 text-xs text-muted-foreground">
                      <Heart className="h-3 w-3 inline mr-1" />
                      {message.reactionCount}
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className={`${className} h-full`}>
      <Tabs defaultValue="session" className="h-full flex flex-col">
        <div className="flex-shrink-0 p-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="session" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Session Chat
              {sessionMessages.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {sessionMessages.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="event" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Event Chat
              {eventMessages.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {eventMessages.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="flex-1 min-h-0 px-2 pb-2">
          <TabsContent value="session" className="h-full m-0">
            {renderChatMessages(
              sessionMessages, 
              sessionLoading, 
              sessionError, 
              "No chat messages found for this session"
            )}
          </TabsContent>
          
          <TabsContent value="event" className="h-full m-0">
            {renderChatMessages(
              eventMessages, 
              eventLoading, 
              eventError, 
              "No event chat messages found"
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}