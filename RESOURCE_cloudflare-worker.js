export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    // Handle CORS preflight request
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    try {
      // Check API key exists
      const apiKey = env.OPENAI_API_KEY;

      if (!apiKey) {
        return new Response(
          JSON.stringify({
            error: "OPENAI_API_KEY is missing"
          }),
          {
            status: 500,
            headers: corsHeaders
          }
        );
      }

      // Get user message from website
      const userInput = await request.json();

      // Send request to OpenAI
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",

          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: userInput.messages,
            max_tokens: 300,
            temperature: 0.7
          })
        }
      );

      const data = await response.json();
      console.log("OpenAI response:", JSON.stringify(data));

      // Show OpenAI errors clearly
      if (!response.ok) {
        return new Response(
          JSON.stringify({
            error: data.error?.message || "OpenAI request failed"
          }),
          {
            status: response.status,
            headers: corsHeaders
          }
        );
      }

      // Return successful response
      return new Response(
        JSON.stringify(data),
        {
          status: 200,
          headers: corsHeaders
        }
      );

    } catch (error) {

      return new Response(
        JSON.stringify({
          error: error.message
        }),
        {
          status: 500,
          headers: corsHeaders
        }
      );

    }
  }
};