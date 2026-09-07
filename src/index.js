export default {
  async fetch(request, env) {

    if (request.method === "GET") {
      return new Response("Paystack Account Enquiry API is running");
    }

    if (request.method === "POST") {
      try {
        const body = await request.json();

        // Account enquiry logic zai zo nan

        return Response.json({
          success: true,
          message: "Request received",
          data: body
        });

      } catch (error) {
        return Response.json({
          success: false,
          message: "Invalid request"
        }, { status: 400 });
      }
    }

    return new Response("Method not allowed", {
      status: 405
    });
  }
};
