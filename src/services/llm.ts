import { createParser } from 'eventsource-parser';

const API_URL = 'https://api-integrations.appmedo.com/app-7vcztd2rj18h/api-rLob8RdzAOl9/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse';
const APP_ID = 'app-7vcztd2rj18h';

interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export async function streamLLMResponse(
  messages: Message[],
  onChunk: (text: string) => void,
  onComplete: () => void,
  onError: (error: string) => void
): Promise<void> {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-App-Id': APP_ID,
      },
      body: JSON.stringify({
        contents: messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('No response body');
    }

    const decoder = new TextDecoder();

    const parser = createParser({
      onEvent: (event) => {
        try {
          const data = JSON.parse(event.data);
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            onChunk(text);
          }
        } catch (e) {
          console.error('Error parsing SSE data:', e);
        }
      },
    });

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      parser.feed(chunk);
    }

    onComplete();
  } catch (error) {
    console.error('LLM API Error:', error);
    onError(error instanceof Error ? error.message : 'An error occurred');
  }
}

export async function generateBudgetEstimate(
  origin: string,
  destination: string,
  days: number,
  travelers: number,
  transportation: string,
  accommodation: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    let fullResponse = '';

    const transportMode = transportation === 'public' ? 'public transport (bus/train)' : 
                         transportation === 'personal' ? 'personal vehicle (car/bike)' : 
                         'flight';
    const stayType = accommodation === 'hostel' ? 'hostel/budget accommodation' : 
                    accommodation === 'hotel' ? 'mid-range hotel' : 
                    'luxury hotel/resort';

    const prompt = `You are a travel budget expert for India. Calculate a detailed budget estimate with the following parameters:
- From: ${origin}
- To: ${destination}
- Duration: ${days} days
- Number of travelers: ${travelers}
- Transportation: ${transportMode}
- Accommodation: ${stayType}

Please provide a comprehensive budget breakdown in ₹ (Indian Rupees) including:

1. **Transportation Costs**
   - Calculate distance from ${origin} to ${destination}
   - Provide costs for ${transportMode}
   - Include return journey costs
   - Add local transportation at destination

2. **Accommodation Costs**
   - ${stayType} pricing for ${days} nights
   - Per night and total costs

3. **Food & Dining**
   - Breakfast, lunch, dinner costs per day
   - Total for ${days} days

4. **Activities & Sightseeing**
   - Entry fees for popular attractions in ${destination}
   - Activity costs

5. **Miscellaneous**
   - Shopping, tips, emergency funds

6. **TOTAL BUDGET SUMMARY**
   - Total estimated cost: ₹X
   - Cost per person: ₹Y
   - Daily average: ₹Z

Be realistic with Indian market prices in ₹. Provide specific cost ranges and explain your calculations.`;

    streamLLMResponse(
      [{ role: 'user', parts: [{ text: prompt }] }],
      (chunk) => {
        fullResponse += chunk;
      },
      () => resolve(fullResponse),
      (error) => reject(new Error(error))
    );
  });
}

export async function generateTripPlan(
  origin: string,
  destination: string,
  budget: number,
  travelers: number,
  travelStyle: string,
  duration: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    let fullResponse = '';

    const prompt = `You are an expert travel planner for India. Create a complete trip plan with the following parameters:
- From: ${origin}
- To: ${destination}
- Total budget: ₹${budget} (Indian Rupees)
- Number of travelers: ${travelers}
- Travel style: ${travelStyle}
- Duration: ${duration} days

Please provide:
1. Travel route from ${origin} to ${destination} with distance and best transportation options
2. Detailed cost breakdown in ₹ including:
   - Transportation costs (based on distance from ${origin} to ${destination})
   - Accommodation costs
   - Food expenses
   - Activity/sightseeing costs
   - Miscellaneous expenses
   - **TOTAL ESTIMATED COST**
3. 3-5 recommended hotels in ${destination} with price ranges in ₹ and ratings
4. 5-7 recommended restaurants in ${destination} with cuisine types and price ranges in ₹
5. Detailed day-by-day itinerary with specific time blocks (e.g., "9:00-11:00 AM: Visit Central Museum")

Make the itinerary ${travelStyle === 'relaxing' ? 'relaxed with leisure time' : 'packed with exciting activities'}. Be specific with place names and realistic with Indian pricing in ₹.

IMPORTANT: At the end, provide a clear "## Trip Summary" section with:
- Total estimated cost: ₹X
- Cost per person: ₹Y
- Breakdown by category`;

    streamLLMResponse(
      [{ role: 'user', parts: [{ text: prompt }] }],
      (chunk) => {
        fullResponse += chunk;
      },
      () => resolve(fullResponse),
      (error) => reject(new Error(error))
    );
  });
}

export async function generateMusicRecommendations(
  genre: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    let fullResponse = '';

    const prompt = `You are a music curator specializing in travel playlists. Create personalized music recommendations for a journey with the following preference:
- Genre: ${genre}

Please provide:
1. 3-4 curated playlists perfect for travel
2. For each playlist:
   - A catchy name
   - A brief description of the mood/vibe
   - 8-10 specific song recommendations with artist names
   - For each song, provide a YouTube Music search link in the format: https://music.youtube.com/search?q=SONG_NAME+ARTIST_NAME (replace spaces with +)

Make the recommendations diverse within the genre and perfect for different parts of a journey (starting the trip, scenic drives, relaxing moments, etc.).

Format each song as:
- **Song Name** by Artist Name - [Listen on YouTube Music](https://music.youtube.com/search?q=Song+Name+Artist+Name)`;

    streamLLMResponse(
      [{ role: 'user', parts: [{ text: prompt }] }],
      (chunk) => {
        fullResponse += chunk;
      },
      () => resolve(fullResponse),
      (error) => reject(new Error(error))
    );
  });
}
