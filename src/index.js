export default {
  async fetch(request, env) {

    // CORS
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders
      });
    }

    // GET
    if (request.method === "GET") {
      return new Response(
        "Paystack Account Enquiry API is running",
        {
          headers: corsHeaders
        }
      );
    }

    // POST
    if (request.method === "POST") {
      try {

        const body = await request.json();

        const account_number = body.account_number;
        const bank_code = body.bank_code;

        // Check required fields
        if (!account_number || !bank_code) {
          return Response.json(
            {
              success: false,
              message: "account_number and bank_code are required"
            },
            {
              status: 400,
              headers: corsHeaders
            }
          );
        }

        // Call Paystack
        const paystackResponse = await fetch(
          `https://api.paystack.co/bank/resolve?account_number=${encodeURIComponent(account_number)}&bank_code=${encodeURIComponent(bank_code)}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${env.PAYSTACK_SECRET_KEY}`,
              "Content-Type": "application/json"
            }
          }
        );

        const paystackData = await paystackResponse.json();

        // Return Paystack response
        return Response.json(
          paystackData,
          {
            status: paystackResponse.status,
            headers: corsHeaders
          }
        );

      } catch (error) {

        return Response.json(
          {
            success: false,
            message: "Server error",
            error: error.message
          },
          {
            status: 500,
            headers: corsHeaders
          }
        );
      }
    }

    // Other methods
    return new Response(
      "Method not allowed",
      {
        status: 405,
        headers: corsHeaders
      }
    );
  }
};
