export default {
  async fetch(request, env) {

    // Test GET
    if (request.method === "GET") {
      return Response.json({
        success: true,
        message: "Paystack Account Enquiry API is running"
      });
    }

    // Account enquiry
    if (request.method === "POST") {
      try {
        const body = await request.json();

        const account_number = body.account_number;
        const bank_code = body.bank_code;

        if (!account_number || !bank_code) {
          return Response.json({
            success: false,
            message: "account_number and bank_code are required"
          }, { status: 400 });
        }

        const paystackUrl =
          `https://api.paystack.co/bank/resolve?account_number=${encodeURIComponent(account_number)}&bank_code=${encodeURIComponent(bank_code)}`;

        const response = await fetch(paystackUrl, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${env.PAYSTACK_SECRET_KEY}`
          }
        });

        const data = await response.json();

        return Response.json(data, {
          status: response.status
        });

      } catch (error) {
        return Response.json({
          success: false,
          message: "Server error"
        }, { status: 500 });
      }
    }

    return new Response("Method not allowed", {
      status: 405
    });
  }
};
