import { liteClient } from 'algoliasearch/lite';
// For a lighter bundle size, you can also use the lite version:
// import { liteClient } from 'algoliasearch/lite';

// Initialize the Algolia client
export const searchClient = liteClient(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || ''
);

export const indexName = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'events';

// Event type definition based on the provided example
export interface TimeSlot {
  id: string;
  eventId: string;
  startTime: number;
  endTime: number;
  totalSeats: number;
  availableSeats: number;
  isAvailable: boolean;
}

export interface EventData {
  id: string;
  objectID: string;
  title: string;
  description: string;
  location: string;
  eventTypes: string[];
  pricePerSeat: number;
  coverImage: string;
  galleryImages: string[];
  timeSlots: TimeSlot[];
  coachName: string;
}

// Helper function to parse description from JSON
export const parseDescription = (description: string): string => {
  try {
    const parsed = JSON.parse(description);
    // Handle Tiptap document structure
    if (parsed.type === 'doc' && parsed.content) {
      // Extract text from Tiptap structure
      return parsed.content
        .flatMap((node: any) => 
          node.content?.flatMap((innerNode: any) => innerNode.text || '') || []
        )
        .join(' ')
        .substring(0, 100) + '...';
    }
    return description;
  } catch (e) {
    // If not JSON or parsing fails, return as is (with truncation)
    return description.substring(0, 100) + '...';
  }
};

// Function to fetch unique locations from Algolia index
export async function getUniqueLocations(): Promise<string[]> {
  try {
    const locations = new Set<string>();
    
    // First, try to get facets if available
    try {
      const searchResults = await searchClient.search([
        {
          indexName,
          params: {
            query: '',
            hitsPerPage: 0, // We don't need hits, just facets
            facets: ['location'],
          },
        },
      ]);

      if (searchResults?.results?.[0]) {
        const result = searchResults.results[0] as any;
        // Extract facet values for location
        if (result.facets && result.facets.location) {
          const facetLocations = Object.keys(result.facets.location);
          facetLocations.forEach(loc => locations.add(loc));
          // If we got facets, return them sorted
          return Array.from(locations).sort();
        }
      }
    } catch (facetError) {
      // Faceting might not be configured, fall through to browsing
      console.log('Faceting not available, using browse method');
    }

    // Fallback: Search for all events and extract unique locations
    // We'll do multiple searches to get all results
    let page = 0;
    const hitsPerPage = 1000;
    let hasMore = true;

    while (hasMore) {
      const searchResults = await searchClient.search([
        {
          indexName,
          params: {
            query: '',
            hitsPerPage,
            page,
            attributesToRetrieve: ['location'],
          },
        },
      ]);

      if (searchResults?.results?.[0]) {
        const result = searchResults.results[0] as any;
        if (result.hits && result.hits.length > 0) {
          result.hits.forEach((hit: any) => {
            if (hit.location && typeof hit.location === 'string') {
              locations.add(hit.location);
            }
          });
          
          // Check if there are more pages
          const totalPages = Math.ceil((result.nbHits || 0) / hitsPerPage);
          hasMore = page < totalPages - 1;
          page++;
        } else {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    }

    return Array.from(locations).sort();
  } catch (error) {
    console.error('Error fetching locations from Algolia:', error);
    // Return empty array on error
    return [];
  }
} 