/**
 * Multi-Provider Visual Intelligence Service
 * 
 * Dynamically retrieves official Google Maps place photos, verified building facades,
 * and GPS coordinates across multiple visual search providers with higher free limits:
 * 
 * Supported Providers (Cascade Priority):
 * 1. Serper.dev (SERPER_API_KEY) -> 2,500 Free Queries, dedicated Google Maps & Image endpoints
 * 2. OpenSERP (OPENSERP_URL / OPENSERP_API_KEY) -> Unlimited Self-Hosted Docker or OpenSERP Cloud
 * 3. SerpApi (SERPAPI_API_KEY) -> 100 Queries/mo, Google Maps engine + Google Images fallback
 * 4. Curated Verified Fallbacks -> Instant offline stills for foundational landmarks
 */

export interface PlacePhotoResult {
  photoUrl: string;
  thumbnailUrl: string;
  source: 'google_maps' | 'google_images' | 'serper_maps' | 'openserp_images' | 'curated_maps';
  title?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  rating?: number;
  reviews?: number;
  placeId?: string;
  googleMapsUrl?: string;
  address?: string;
}

// In-memory cache to save API credits and optimize response time
const photoCache = new Map<string, PlacePhotoResult>();

// Curated verified authentic photos for foundational demo & historical landmarks
const VERIFIED_MAPS_PHOTOS: Record<string, Partial<PlacePhotoResult>> = {
  'ramoji': {
    photoUrl: '/images/google_ramoji_film_city.jpg',
    thumbnailUrl: '/images/google_ramoji_film_city.jpg',
    source: 'curated_maps',
    title: 'Ramoji Film City (Official Google Maps Entrance)',
    coordinates: { lat: 17.2543, lng: 78.6808 },
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ramoji+Film+City+Hyderabad'
  },
  'mukesh': {
    photoUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkV4ZpQRSeOQ4YHBTT-b5h-P5VVQGA7Dk43hZvaPBIqgxuo3WIFlMXje7ifO25-gFNnjxSDK9obHz05KJM1EcAHx2-Kvg_jGwFVR5tCDiVw-XxyJVMeqyyyiW6J_63Pz42zvCAUwFJK7D0=w1000-h1000-c-n',
    thumbnailUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkV4ZpQRSeOQ4YHBTT-b5h-P5VVQGA7Dk43hZvaPBIqgxuo3WIFlMXje7ifO25-gFNnjxSDK9obHz05KJM1EcAHx2-Kvg_jGwFVR5tCDiVw-XxyJVMeqyyyiW6J_63Pz42zvCAUwFJK7D0=w1000-h1000-c-n',
    source: 'google_maps',
    title: 'Mukesh Mills Heritage Mill Compound (Colaba)',
    coordinates: { lat: 18.9138, lng: 72.8242 },
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Mukesh+Mills+Colaba+Mumbai'
  },
  'sewri christian cemetery': {
    photoUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmrljuV8Eg5HaCkGQ1qZv_hhnxKMzZLmhLlcpDEK-uxOAfMOB9Ngi-2V_dERRIKWgw0NnMQAJA30OE2aXQVHKLlQrchxEZbFV4aFnwDfTsfyTSGiod7UdIOHooEXy44ZTBlTDoM=w1000-h1000-c-n',
    thumbnailUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmrljuV8Eg5HaCkGQ1qZv_hhnxKMzZLmhLlcpDEK-uxOAfMOB9Ngi-2V_dERRIKWgw0NnMQAJA30OE2aXQVHKLlQrchxEZbFV4aFnwDfTsfyTSGiod7UdIOHooEXy44ZTBlTDoM=w1000-h1000-c-n',
    source: 'google_maps',
    title: 'Sewri Christian Cemetery (Victorian Gothic Grounds)',
    coordinates: { lat: 19.0034, lng: 72.8516 },
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sewri+Christian+Cemetery+Mumbai'
  },
  'vasai fort': {
    photoUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmSXEG6g37mMzU-bTAqbG08ahv8GWATgZzwXYgw2ecfzjB9dOD3hno61D8EoX47muaKMTKe5S46WwTQKeZtknfmhKzExkzd6D_qmZe79xI6RN7w05yEyPDg5tHcSsX0xytWFN5yDlp42MiG=w1000-h1000-c-n',
    thumbnailUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmSXEG6g37mMzU-bTAqbG08ahv8GWATgZzwXYgw2ecfzjB9dOD3hno61D8EoX47muaKMTKe5S46WwTQKeZtknfmhKzExkzd6D_qmZe79xI6RN7w05yEyPDg5tHcSsX0xytWFN5yDlp42MiG=w1000-h1000-c-n',
    source: 'google_maps',
    title: 'Vasai Fort Church Ruins & Crypts',
    coordinates: { lat: 19.3295, lng: 72.8142 },
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vasai+Fort+Church+Mumbai'
  },
  'richardson': {
    photoUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlwyFeW0DQP5409vs9sSjXfX_h0EwsBkIi4eOx4gLqZ7gp5KkEKq_o-7MUG4S8QYOceUtcAGsItiTI5rkjDYCX7er_x5cPHTnGxS204gsz_wriWfBqYuJtNTtljLo21ZkfPBEY=w1000-h1000-c-n',
    thumbnailUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlwyFeW0DQP5409vs9sSjXfX_h0EwsBkIi4eOx4gLqZ7gp5KkEKq_o-7MUG4S8QYOceUtcAGsItiTI5rkjDYCX7er_x5cPHTnGxS204gsz_wriWfBqYuJtNTtljLo21ZkfPBEY=w1000-h1000-c-n',
    source: 'google_maps',
    title: 'Richardson & Cruddas Heavy Engineering Works',
    coordinates: { lat: 18.9658, lng: 72.8329 },
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Richardson+and+Cruddas+Byculla+Mumbai'
  },
  'cotton': {
    photoUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlYCvjt9dk8_mFb5_kPZpYLRpvlQmkIaL9hvykiDAeMa1Ep-1uvr2rxbXIb4IZtE2OyvWtodJFc9bD8IWQclXP0P_HV2o8qUxMgwsODTEiXOp3OU9AIOlH1L_NDOXimabsy2tF2=w1000-h1000-c-n',
    thumbnailUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlYCvjt9dk8_mFb5_kPZpYLRpvlQmkIaL9hvykiDAeMa1Ep-1uvr2rxbXIb4IZtE2OyvWtodJFc9bD8IWQclXP0P_HV2o8qUxMgwsODTEiXOp3OU9AIOlH1L_NDOXimabsy2tF2=w1000-h1000-c-n',
    source: 'google_maps',
    title: 'Cotton Green Port Trust Godowns & Cotton Exchange Depot',
    coordinates: { lat: 18.9840, lng: 72.8482 },
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cotton+Green+Port+Trust+Godowns+Mumbai'
  },
  'reay': {
    photoUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmEV2tzxCkSys6wOS3sJVZH9FG0u8K5XmUIrY_RsseMPlMIsZzdo7T8weZV7S9SIooNLnRNkE6m3tUuyKocoma7Np8LzjiS8kpqaJb7PLEGl1f45gGnbx4hH4vOUmlzye8UNBgF=w1000-h1000-c-n',
    thumbnailUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmEV2tzxCkSys6wOS3sJVZH9FG0u8K5XmUIrY_RsseMPlMIsZzdo7T8weZV7S9SIooNLnRNkE6m3tUuyKocoma7Np8LzjiS8kpqaJb7PLEGl1f45gGnbx4hH4vOUmlzye8UNBgF=w1000-h1000-c-n',
    source: 'google_maps',
    title: 'Reay Road Timber & Iron Yard Sheds',
    coordinates: { lat: 18.9710, lng: 72.8454 },
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Darukhana+Reay+Road+Timber+Yards+Mumbai'
  },
  'sewri container': {
    photoUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkypVoDMsuWL8dpamQSh-tLDArD9Jjcv-5PhWxBHYSJEQB3r8g3vWybL1QG5W0L32gqhJYhiMtd6pz5fyxGO-JlzoNxlk8qRdHqUSJwbieWaZIP_MrxA5dlPv3YUPfDeecRFnod=w1000-h1000-c-n',
    thumbnailUrl: 'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkypVoDMsuWL8dpamQSh-tLDArD9Jjcv-5PhWxBHYSJEQB3r8g3vWybL1QG5W0L32gqhJYhiMtd6pz5fyxGO-JlzoNxlk8qRdHqUSJwbieWaZIP_MrxA5dlPv3YUPfDeecRFnod=w1000-h1000-c-n',
    source: 'google_maps',
    title: 'Sewri Container Freight Station & Rail Godown',
    coordinates: { lat: 18.9984, lng: 72.8622 },
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Sewri+Container+Freight+Station+Mumbai'
  },
  'annapurna': {
    photoUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=600&auto=format&fit=crop',
    source: 'curated_maps',
    title: 'Annapurna Studios Virtual Stage',
    coordinates: { lat: 17.4300, lng: 78.4350 },
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Annapurna+Studios+Banjara+Hills+Hyderabad'
  },
  'trilith': {
    photoUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop',
    source: 'curated_maps',
    title: 'Trilith Studios & Prysm Stages',
    coordinates: { lat: 33.4735, lng: -84.5072 },
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Trilith+Studios+Fayetteville+Georgia'
  },
  'leavesden': {
    photoUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=600&auto=format&fit=crop',
    source: 'curated_maps',
    title: 'Warner Bros. Studios Leavesden',
    coordinates: { lat: 51.6908, lng: -0.4180 },
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Warner+Bros+Studios+Leavesden'
  },
  'film city': {
    photoUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1200&auto=format&fit=crop',
    thumbnailUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=600&auto=format&fit=crop',
    source: 'curated_maps',
    title: 'Dadasaheb Phalke Chitranagari (Film City Mumbai)',
    coordinates: { lat: 19.1636, lng: 72.8906 },
    googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Film+City+Goregaon+Mumbai'
  }
};

class VisualIntelligenceService {
  /**
   * Check if any visual intelligence provider is configured
   */
  isConfigured(): boolean {
    return Boolean(
      process.env.SERPER_API_KEY ||
      process.env.OPENSERP_URL ||
      process.env.OPENSERP_API_KEY ||
      process.env.SERPAPI_API_KEY
    );
  }

  /**
   * Get metadata describing the currently active visual provider
   */
  getActiveProvider(): { id: string; name: string; configured: boolean } {
    if (process.env.SERPER_API_KEY) {
      return {
        id: 'serper',
        name: 'Serper.dev (2,500 Queries - Google Maps & Images)',
        configured: true
      };
    }
    if (process.env.OPENSERP_URL || process.env.OPENSERP_API_KEY) {
      return {
        id: 'openserp',
        name: `OpenSERP (${process.env.OPENSERP_URL || 'Self-Hosted / Cloud'})`,
        configured: true
      };
    }
    if (process.env.SERPAPI_API_KEY) {
      return {
        id: 'serpapi',
        name: 'SerpApi (Google Maps & Images)',
        configured: true
      };
    }
    return {
      id: 'curated',
      name: 'Curated Location Stills (Demo Mode)',
      configured: false
    };
  }

  /**
   * Main entry point: Get verified Google Maps place photo / building photo
   */
  async getPlacePhoto(placeName: string, city: string = 'Mumbai'): Promise<PlacePhotoResult | null> {
    if (!placeName || placeName.trim().length === 0) return null;

    const cacheKey = `${placeName.toLowerCase().trim()}___${(city || '').toLowerCase().trim()}`;
    if (photoCache.has(cacheKey)) {
      return photoCache.get(cacheKey)!;
    }

    // 1. Serper.dev (Priority 1: generous 2,500 free query tier)
    if (process.env.SERPER_API_KEY?.trim()) {
      const serperResult = await this.fetchSerper(placeName, city);
      if (serperResult) {
        photoCache.set(cacheKey, serperResult);
        return serperResult;
      }
    }

    // 2. OpenSERP (Priority 2: unlimited self-hosted or OpenSERP Cloud)
    if (process.env.OPENSERP_URL?.trim() || process.env.OPENSERP_API_KEY?.trim()) {
      const openSerpResult = await this.fetchOpenSerp(placeName, city);
      if (openSerpResult) {
        photoCache.set(cacheKey, openSerpResult);
        return openSerpResult;
      }
    }

    // 3. SerpApi (Priority 3: Google Maps engine)
    if (process.env.SERPAPI_API_KEY?.trim()) {
      const serpApiResult = await this.fetchSerpApi(placeName, city);
      if (serpApiResult) {
        photoCache.set(cacheKey, serpApiResult);
        return serpApiResult;
      }
    }

    // 4. Curated verified backup still
    const fallback = this.matchCurated(placeName);
    if (fallback) {
      photoCache.set(cacheKey, fallback);
      return fallback;
    }

    return null;
  }

  /**
   * Provider 1: Serper.dev (Google Maps & Google Images)
   */
  private async fetchSerper(placeName: string, city: string): Promise<PlacePhotoResult | null> {
    const key = process.env.SERPER_API_KEY?.trim();
    if (!key) return null;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7500);

      // A. Query Serper /maps endpoint for exact Google Maps place details
      const mapsRes = await fetch('https://google.serper.dev/maps', {
        method: 'POST',
        headers: {
          'X-API-KEY': key,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: `${placeName}, ${city}`,
          num: 1
        }),
        signal: controller.signal
      });

      let placeData: any = null;
      if (mapsRes.ok) {
        const json = await mapsRes.json();
        if (Array.isArray(json.places) && json.places.length > 0) {
          placeData = json.places[0];
        }
      }

      // B. Query Serper /images endpoint for real building exterior photo
      const imgRes = await fetch('https://google.serper.dev/images', {
        method: 'POST',
        headers: {
          'X-API-KEY': key,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: `${placeName} ${city} building exterior filming location`,
          num: 3
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      let photoUrl: string | undefined = placeData?.thumbnailUrl;
      if (imgRes.ok) {
        const imgJson = await imgRes.json();
        if (Array.isArray(imgJson.images) && imgJson.images.length > 0) {
          photoUrl = imgJson.images[0].imageUrl || imgJson.images[0].thumbnailUrl || photoUrl;
        }
      }

      if (photoUrl) {
        return {
          photoUrl,
          thumbnailUrl: photoUrl,
          source: 'serper_maps',
          title: placeData?.title || placeName,
          coordinates: (placeData?.latitude && placeData?.longitude) ? {
            lat: placeData.latitude,
            lng: placeData.longitude
          } : undefined,
          rating: placeData?.rating,
          reviews: placeData?.ratingCount,
          address: placeData?.address,
          googleMapsUrl: placeData?.link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${placeName}, ${city}`)}`
        };
      }
    } catch (err: any) {
      console.warn(`[VisualIntelligence] Serper error for "${placeName}":`, err?.message || err);
    }
    return null;
  }

  /**
   * Provider 2: OpenSERP (Self-Hosted / Cloud)
   */
  private async fetchOpenSerp(placeName: string, city: string): Promise<PlacePhotoResult | null> {
    const rawUrl = process.env.OPENSERP_URL?.trim() || 'http://localhost:7000';
    const baseUrl = rawUrl.replace(/\/$/, '');
    const apiKey = process.env.OPENSERP_API_KEY?.trim();

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7500);

      const query = encodeURIComponent(`${placeName} ${city} building exterior filming location`);
      const headers: Record<string, string> = { 'Accept': 'application/json' };
      if (apiKey) {
        headers['Authorization'] = `Bearer ${apiKey}`;
      }

      let res = await fetch(`${baseUrl}/images?text=${query}`, {
        headers,
        signal: controller.signal
      });

      if (!res.ok) {
        res = await fetch(`${baseUrl}/google/images?text=${query}`, {
          headers,
          signal: controller.signal
        });
      }

      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        const results = Array.isArray(data.results) ? data.results : (Array.isArray(data) ? data : []);
        if (results.length > 0) {
          const item = results[0];
          const photo = item.image_url || item.url || item.thumbnail;
          if (photo) {
            return {
              photoUrl: photo,
              thumbnailUrl: item.thumbnail || photo,
              source: 'openserp_images',
              title: item.title || placeName,
              googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${placeName}, ${city}`)}`
            };
          }
        }
      }
    } catch (err: any) {
      console.warn(`[VisualIntelligence] OpenSERP error for "${placeName}":`, err?.message || err);
    }
    return null;
  }

  /**
   * Provider 3: SerpApi (Google Maps Engine & Google Images Fallback)
   */
  private async fetchSerpApi(placeName: string, city: string): Promise<PlacePhotoResult | null> {
    const apiKey = process.env.SERPAPI_API_KEY?.trim();
    if (!apiKey) return null;

    // Step A: engine=google_maps
    try {
      const query = `${placeName}, ${city}`.trim();
      const mapsUrl = `https://serpapi.com/search.json?engine=google_maps&q=${encodeURIComponent(query)}&api_key=${apiKey}`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7500);

      const res = await fetch(mapsUrl, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();

        // Check place_results
        if (data.place_results) {
          const pr = data.place_results;
          const photoUrl = pr.thumbnail || (Array.isArray(pr.photos) && pr.photos[0]?.image);
          if (photoUrl) {
            return {
              photoUrl,
              thumbnailUrl: photoUrl,
              source: 'google_maps',
              title: pr.title || placeName,
              coordinates: pr.gps_coordinates ? {
                lat: pr.gps_coordinates.latitude,
                lng: pr.gps_coordinates.longitude
              } : undefined,
              rating: pr.rating,
              reviews: pr.reviews,
              placeId: pr.place_id,
              googleMapsUrl: pr.link || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
              address: pr.address
            };
          }
        }

        // Check local_results
        if (Array.isArray(data.local_results) && data.local_results.length > 0) {
          for (const item of data.local_results) {
            if (item.thumbnail) {
              return {
                photoUrl: item.thumbnail,
                thumbnailUrl: item.thumbnail,
                source: 'google_maps',
                title: item.title || placeName,
                coordinates: item.gps_coordinates ? {
                  lat: item.gps_coordinates.latitude,
                  lng: item.gps_coordinates.longitude
                } : undefined,
                rating: item.rating,
                reviews: item.reviews,
                placeId: item.place_id,
                googleMapsUrl: item.links?.directions || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
                address: item.address
              };
            }
          }
        }
      }
    } catch (err: any) {
      console.warn(`[VisualIntelligence] SerpApi Google Maps error for "${placeName}":`, err?.message || err);
    }

    // Step B: engine=google_images
    try {
      const searchTerms = `${placeName} ${city} building exterior filming location`;
      const imagesUrl = `https://serpapi.com/search.json?engine=google_images&q=${encodeURIComponent(searchTerms)}&api_key=${apiKey}&ijn=0`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 7500);

      const res = await fetch(imagesUrl, { signal: controller.signal });
      clearTimeout(timeout);

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.images_results) && data.images_results.length > 0) {
          const firstImg = data.images_results[0];
          const imgUrl = firstImg.original || firstImg.thumbnail;
          if (imgUrl) {
            return {
              photoUrl: imgUrl,
              thumbnailUrl: firstImg.thumbnail || imgUrl,
              source: 'google_images',
              title: firstImg.title || placeName,
              googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${placeName}, ${city}`)}`
            };
          }
        }
      }
    } catch (err: any) {
      console.warn(`[VisualIntelligence] SerpApi Google Images error for "${placeName}":`, err?.message || err);
    }

    return null;
  }

  private matchCurated(placeName: string): PlacePhotoResult | null {
    const lower = placeName.toLowerCase();
    for (const [key, value] of Object.entries(VERIFIED_MAPS_PHOTOS)) {
      if (lower.includes(key)) {
        return {
          photoUrl: value.photoUrl!,
          thumbnailUrl: value.thumbnailUrl || value.photoUrl!,
          source: 'curated_maps',
          title: value.title || placeName,
          coordinates: value.coordinates,
          googleMapsUrl: value.googleMapsUrl
        };
      }
    }
    return null;
  }
}

export const visualIntelligenceService = new VisualIntelligenceService();
// Alias for backward compatibility across existing imports
export const serpApiClient = visualIntelligenceService;
