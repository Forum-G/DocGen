export async function generateAPIDocs(apiTitle, apiVersion, endpointDefs) {
  try {
    const safeEndpointDefs = endpointDefs.replace(/\|/g, "\\|");

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `
You are an expert API documentation writer.

Rules:
- Use clean Markdown with proper hierarchy (# title, ## per endpoint, ### for sub-sections)
- Use ONLY # style headings (do NOT use === or --- underline headings)
- Use tables for parameters, headers, and responses with columns: Name | Type | Required | Description
- Table cells must NEVER contain line breaks
- Do NOT use the | character inside table cells
- Format enum values as comma-separated inline code values (example: \`admin\`, \`user\`, \`viewer\`)
- Add fenced json code blocks for request/response body examples
- Include a summary table at the very top: Method | Endpoint | Description
- Output ONLY the Markdown.

Generate professional API documentation for "${apiTitle}" ${apiVersion}.

Endpoint definitions:

${safeEndpointDefs}
        `,
      }),
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    return data.result;

  } catch (error) {
    console.error("Doc generation error:", error);
    throw error;
  }
}