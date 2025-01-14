const express = require("express");
const router = express.Router();
const paymentsApi = require("../config/square");



router.post("/create-payment", async (req, res) => {
  console.log("trigger");
  const { sourceId, amount } = req.body;
  console.log(sourceId, amount);


  try {
    const response = await paymentsApi.createPayment({
      sourceId,
      idempotencyKey: `${Date.now()}`,
      amountMoney: {
        amount: amount,
        currency: "USD",
      },
    });

    // Handle BigInt serialization
    const result = JSON.parse(
      JSON.stringify(response.result, (key, value) => (typeof value === "bigint" ? value.toString() : value))
    );

    console.log("response : ", response);
    console.log("result : ", result);

    res.status(200).json(result);
    
  } catch (error) {

    console.error("error : ", error);
    res.status(500).json({ error: error.message });

  }
});

module.exports = router;
