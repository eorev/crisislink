
/**
 * Helper functions for interacting with FEMA APIs
 */

// Base URL for FEMA APIs
const FEMA_API_BASE_URL = 'https://www.fema.gov/api/open/v2';

// Endpoints
const ENDPOINTS = {
  disasterDeclarations: `${FEMA_API_BASE_URL}/DisasterDeclarationsSummaries`,
  housingAssistance: `${FEMA_API_BASE_URL}/HousingAssistanceOwners`,
};

// Types
export interface DisasterDeclaration {
  disasterNumber: number;
  declarationTitle: string;
  declarationDate: string;
  disasterType: string;
  incidentType: string;
  state: string;
  county: string;
  placeCode: string;
  designatedArea: string;
  declarationRequestNumber: string;
  ihProgramDeclared: boolean;
  iaProgramDeclared: boolean;
  paProgramDeclared: boolean;
  hmProgramDeclared: boolean;
  incidentBeginDate: string;
  incidentEndDate: string;
  declaredCountyArea: string;
  hash: string;
  lastRefresh: string;
  id: string;
}

export interface HousingAssistance {
  disasterNumber: number;
  state: string;
  county: string;
  validRegistrations: number;
  totalApprovedAmount: number;
  averageApprovedAmount: number;
  hash: string;
  lastRefresh: string;
  id: string;
}

/**
 * Fetches disaster declarations with optional filtering
 * @param filter Optional OData filter string
 * @param top Number of results to return
 * @returns Promise containing disaster declarations
 */
export const fetchDisasterDeclarations = async (
  filter?: string,
  top: number = 10
): Promise<DisasterDeclaration[]> => {
  try {
    let url = `${ENDPOINTS.disasterDeclarations}?$top=${top}`;
    
    if (filter) {
      url += `&$filter=${encodeURIComponent(filter)}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching disaster declarations:', error);
    throw error;
  }
};

/**
 * Fetches housing assistance data with optional filtering
 * @param filter Optional OData filter string
 * @param top Number of results to return
 * @returns Promise containing housing assistance data
 */
export const fetchHousingAssistance = async (
  filter?: string,
  top: number = 10
): Promise<HousingAssistance[]> => {
  try {
    let url = `${ENDPOINTS.housingAssistance}?$top=${top}`;
    
    if (filter) {
      url += `&$filter=${encodeURIComponent(filter)}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching housing assistance data:', error);
    throw error;
  }
};

/**
 * Example filter usage:
 * 
 * Recent disasters:
 * "declarationDate ge '2023-01-01'"
 * 
 * Specific disaster type:
 * "disasterType eq 'DR' and incidentType eq 'Flood'"
 * 
 * Specific state:
 * "state eq 'CA'"
 */
