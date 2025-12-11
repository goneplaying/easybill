// Airtable API utility functions
const AIRTABLE_BASE_ID = "appe8E88rjO5PPZwy";

// Fetch data from Airtable
export async function fetchAirtableData(apiKey: string, tableName: string, viewId?: string) {
  // Build URL with optional view parameter
  let url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`;
  
  // Add view parameter if provided
  if (viewId) {
    url += `?view=${encodeURIComponent(viewId)}`;
  }
  
  try {
    // Validate API key format (Airtable personal access tokens start with "pat")
    if (!apiKey || (!apiKey.startsWith("pat") && !apiKey.startsWith("key"))) {
      throw new Error("Invalid API key format. Airtable API keys should start with 'pat' (Personal Access Token) or 'key' (API Key).");
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    // If view not found (422), try without the view
    if (response.status === 422 && viewId) {
      console.warn(`View "${viewId}" not found, trying without view parameter...`);
      const urlWithoutView = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(tableName)}`;
      const responseWithoutView = await fetch(urlWithoutView, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!responseWithoutView.ok) {
        const errorText = await responseWithoutView.text();
        let errorMessage = `Airtable API error: ${responseWithoutView.status} ${responseWithoutView.statusText}`;
        
        try {
          const errorJson = JSON.parse(errorText);
          if (errorJson.error?.message) {
            errorMessage += `\n\nDetails: ${errorJson.error.message}`;
          }
        } catch {
          errorMessage += `\n\nResponse: ${errorText}`;
        }
        
        throw new Error(errorMessage);
      }

      const data = await responseWithoutView.json();
      return data.records.map((record: any) => ({
        id: record.id,
        ...record.fields,
      }));
    }

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `Airtable API error: ${response.status} ${response.statusText}`;
      
      if (response.status === 401) {
        errorMessage += "\n\nAuthentication failed. Please check:";
        errorMessage += "\n1. Your API key is valid and not expired";
        errorMessage += "\n2. Your API key has access to this base";
        errorMessage += "\n3. You're using a Personal Access Token (starts with 'pat')";
        errorMessage += "\n4. The token has the correct scopes (data.records:read)";
      } else if (response.status === 404) {
        errorMessage += `\n\nTable "${tableName}" not found. Please check:`;
        errorMessage += "\n1. The table name is correct (case-sensitive)";
        errorMessage += "\n2. The table exists in this base";
      } else if (response.status === 422) {
        errorMessage += `\n\nInvalid request. This might be due to:`;
        errorMessage += "\n1. View ID not found or not accessible";
        errorMessage += "\n2. Invalid table name";
        errorMessage += "\n3. Missing required parameters";
      }
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error?.message) {
          errorMessage += `\n\nDetails: ${errorJson.error.message}`;
        }
      } catch {
        errorMessage += `\n\nResponse: ${errorText}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    // Transform Airtable records to a more usable format
    return data.records.map((record: any) => ({
      id: record.id,
      ...record.fields,
    }));
  } catch (error) {
    console.error("Error fetching Airtable data:", error);
    console.error("URL:", url);
    console.error("API Key (first 10 chars):", apiKey ? `${apiKey.substring(0, 10)}...` : "missing");
    throw error;
  }
}

