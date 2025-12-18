// Test utility to verify Airtable connection
// This can be called from the browser console to test the API key

export async function testAirtableConnection(apiKey: string, baseId: string, tableName: string) {
  const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}?maxRecords=1`;
  
  console.log("Testing Airtable connection...");
  console.log("URL:", url);
  console.log("API Key (first 10 chars):", apiKey ? `${apiKey.substring(0, 10)}...` : "missing");
  
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response:", errorText);
      try {
        const errorJson = JSON.parse(errorText);
        console.error("Parsed error:", errorJson);
      } catch {
        console.error("Raw error text:", errorText);
      }
      return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
    }

    const data = await response.json();
    console.log("Success! Data:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Network error:", error);
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

















