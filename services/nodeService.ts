
import { ApiResponse, MilestoneInfo } from '../types';

const BASE_URL = 'https://web-production-6d2f8.up.railway.app';
const API_URL = `${BASE_URL}/all-nodes`;

/**
 * Fetches the current milestone target for the network.
 * Hardcoded based on latest protocol specifications.
 */
export const fetchMilestoneInfo = async (): Promise<MilestoneInfo> => {
  // Coming soon, this might come from a config endpoint or on-chain state and reflects to the users the current milestone xandeum.network/innovation-eras
  return {
    version: '1.2',
    name: 'Bonn',
    goal: 'Evict & Replace',
    description: 'The Main Era enables real-world use by sedApps (Storage-Enabled dApps). Features basic BFT, trust anchoring to Solana, and the launch of info.wiki(early support for sedApps).'
  };
};

/**
 * Fetches network data for the Xandeum storage layer.
 */
export const fetchNodeData = async (): Promise<ApiResponse> => {
  // 1. Attempt Direct Fetch
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });

    if (response.ok) {
      return await response.json() as ApiResponse;
    }
  } catch (error) {
    // Fail silently
  }

  // 2. Attempt via corsproxy.io (Primary Proxy)
  try {
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(API_URL)}`;
    const response = await fetch(proxyUrl);
    
    if (response.ok) {
      return await response.json() as ApiResponse;
    }
  } catch (error) {
    // Fail silently
  }

  // 3. Attempt via allorigins.win (Secondary Proxy)
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(API_URL)}&t=${Date.now()}`;
    const response = await fetch(proxyUrl);

    if (response.ok) {
      return await response.json() as ApiResponse;
    }
  } catch (error) {
    // Fail silently
  }

  throw new Error('Unable to retrieve network data. The Xandeum API is currently unreachable.');
};