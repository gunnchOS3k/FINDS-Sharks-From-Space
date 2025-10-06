import { GoogleGenAI } from '@google/genai';
import type { ApiResponse } from '../types';
import { GEMINI_PROMPT_TEMPLATE, RESPONSE_SCHEMA } from '../constants';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. Using mocked data for API calls.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateHotspots = async (region: string, n: number): Promise<ApiResponse | null> => {
    // Try API base URL first (Cloudflare Worker)
    const apiBase = import.meta.env.VITE_API_BASE;
    if (apiBase) {
        try {
            const response = await fetch(`${apiBase}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ region, n })
            });
            
            if (response.ok) {
                const data = await response.json();
                // Add unique IDs to each hotspot for React keys and selection
                data.hotspots = data.hotspots.map((h: any) => ({...h, id: crypto.randomUUID()}));
                return data;
            }
        } catch (error) {
            console.warn('API request failed, falling back to demo data:', error);
        }
    }
    
    // Fallback to demo data
    try {
        const response = await fetch('/demo.json');
        if (response.ok) {
            const data = await response.json();
            // Add unique IDs to each hotspot for React keys and selection
            data.hotspots = data.hotspots.map((h: any) => ({...h, id: crypto.randomUUID()}));
            return data;
        }
    } catch (error) {
        console.warn('Demo data fetch failed, using mock data:', error);
    }
    
    // Final fallback: mock data
    if (!process.env.API_KEY) {
        // Mocked response for development without API key
        return new Promise(resolve => setTimeout(() => {
            const mockData = {
                region: region,
                params: { n: n, bbox: null, seed: 42 },
                hotspots: Array.from({ length: n }, () => ({
                    id: crypto.randomUUID(),
                    lat: 40.7 + (Math.random() - 0.5) * 0.5,
                    lon: -74.0 + (Math.random() - 0.5) * 0.5,
                    score: Math.random()
                }))
            };
            resolve(mockData);
        }, 1500));
    }
  
    const prompt = GEMINI_PROMPT_TEMPLATE
        .replace('{REGION}', region)
        .replace('{N}', n.toString());

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: RESPONSE_SCHEMA,
                temperature: 0.7,
            },
        });
        
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText) as ApiResponse;

        // Add unique IDs to each hotspot for React keys and selection
        data.hotspots = data.hotspots.map(h => ({...h, id: crypto.randomUUID()}));

        return data;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate hotspots. Please check the console for details.");
    }
};