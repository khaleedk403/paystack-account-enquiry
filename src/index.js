export default {
  async fetch(request, env) {

    // GET - test API
    if (request.method === "GET") {
      return Response.json({
        success: true,
        message: "Paystack Account Enquiry API is running"
      });
    }

    // POST - account enquiry
    if (request.method === "POST") {
      try {
        const body = await request.json();

        const { account_number, bank_code } = body;

        if (!account_number || !bank_code) {
          return Response.json({
            success: false,
            message: "account_number and bank_code are required"
          }, { status: 400 });
        }

        // Send request to Paystack
        const response = await fetch(
          `https://api.paystack.co/bank/resolve?account_number=${encodeURIComponent(account_number)}&bank_code=${encodeURIComponent(bank_code)}`,
          {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${env.PAYSTACK_SECRET_KEY}`
            }
          }
        );

        const data = await response.json();

        return Response.json(data, {
          status: response.status
        });

      } catch (error) {
        return Response.json({
          success: false,
          message: "Server error",
          error: error.message
        }, { status: 500 });
      }
    }

    return new Response("Method not allowed", {
      status: 405
    });
  }
};
