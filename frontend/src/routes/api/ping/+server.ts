import type { RequestHandler } from '@sveltejs/kit';

/**
 * API route that forwards the request to the external API
 * This keeps the external domain hidden from the client
 */
export const GET: RequestHandler = async ({ request }) => {
  try {
    console.log('API route accessed');
    
    // Set a timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch('http://localhost:6200/ping', {
      signal: controller.signal,
      headers: {
        // Forward any needed headers from the original request
        'Accept': 'application/json'
      }
    });
    
    // Clear the timeout as we got a response
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error(`External API error: ${response.status} ${response.statusText}`);
      return new Response(
        JSON.stringify({ 
          error: 'API request failed', 
          status: response.status,
          message: response.statusText
        }), 
        {
          status: response.status,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const data = await response.json();
    return new Response(
      JSON.stringify(data), 
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      }
    );
  } catch (error) {
    console.error('API route error:', error);
    
    // Handle abort errors separately
    if (error instanceof Error && error.name === 'AbortError') {
      return new Response(
        JSON.stringify({ error: 'Request timeout', message: 'The API request timed out' }), 
        {
          status: 504,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to connect to API',
        message: errorMessage
      }), 
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
};