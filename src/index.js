export default {
  async fetch(request, env) {
    return new Response(
      JSON.stringify({
        success: true,
        message: "Paystack Account Enquiry API is running"
      }),
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
  }
};
