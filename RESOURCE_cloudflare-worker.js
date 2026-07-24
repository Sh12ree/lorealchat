// Copy this code into your Cloudflare Worker script

export default {
  async fetch(request, env) {

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json"
    };

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    try {

      const apiKey = env.OPENAI_API_KEY;

      const userInput = await request.json();

      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {

          method: "POST",

          headers: {

            Authorization: `Bearer ${apiKey}`,

            "Content-Type": "application/json"

          },

          body: JSON.stringify({

            model: "gpt-4o",

            messages: userInput.messages,

            max_completion_tokens: 300

          })

        }
      );

      const data = await response.json();

      return new Response(

        JSON.stringify(data),

        {

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