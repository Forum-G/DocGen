const ANTHROPIC_API = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";

const SYSTEM_PROMPT = `You are an expert API documentation writer. \
Convert raw endpoint definitions into beautiful, professional Markdown documentation.

Rules:
- Use clean Markdown with proper hierarchy (# title, ## per endpoint, ### for sub-sections)
- Include HTTP method badges in backticks: \`GET\`, \`POST\`, \`PUT\`, \`DELETE\`, \`PATCH\`
- Use tables for parameters, headers, and responses with columns: Name | Type | Required | Description
- Add fenced json code blocks for request/response body examples
- Include a summary table at the very top: Method | Endpoint | Description
- Be thorough but concise — no filler text
- Output ONLY the Markdown, nothing else`;

/**
 * Call Anthropic Messages API to generate API docs from raw endpoint definitions.
 * @param {string} apiTitle
 * @param {string} apiVersion
 * @param {string} endpointDefs
 * @returns {Promise<string>} Generated Markdown string
 */
export async function generateAPIDocs(apiTitle, apiVersion, endpointDefs) {
  const response = await fetch(ANTHROPIC_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Generate professional API documentation for "${apiTitle}" ${apiVersion}.\n\nEndpoint definitions:\n\n${endpointDefs}`,
        },
      ],
    }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message || "Anthropic API error");
  }

  return data.content.map((block) => block.text || "").join("");
}
