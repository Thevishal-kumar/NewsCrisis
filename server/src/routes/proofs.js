const router = require('express').Router();
const Report = require('../models/Report'); // Your Mongoose model for reports
const validator = require('validator');

// This is a placeholder for your ZKP generation logic
const generateZkp = async (report) => {
  // In a real implementation, you'd use a library like snarkjs or circom
  // For the hackathon, we'll create a simple hash as a stand-in "proof"
  const { createHmac } = require('crypto');
  const secret = process.env.ZKP_SECRET || 'aegis-secret';
  const proof = createHmac('sha256', secret)
    .update(`reportId:${report._id},status:${report.label}`)
    .digest('hex');
  return proof;
};

// The main endpoint logic
router.post('/generate', async (req, res, next) => {
  try {
    const { reportId } = req.body;
    if (!validator.isMongoId(reportId)) {
      return res.status(400).json({ error: 'Invalid report ID' });
    }

    // Check if payment is already provided in the header
    const paymentHeader = req.header('X-PAYMENT');

    if (!paymentHeader) {
      // --- x402 Flow: Step 1 - Request Payment ---
      // The client needs to pay. Respond with 402.
      return res.status(402).json({
        message: 'Payment required to generate proof.',
        // These details tell the client HOW to pay
        paymentDetails: {
          asset: 'USDC',
          amount: '0.05', // Charge 5 cents
          destination: process.env.TREASURY_WALLET_ADDRESS,
          network: 'base-sepolia', // Use a testnet for the hackathon
        },
      });
    }

    // --- x402 Flow: Step 2 - Verify Payment and Serve Content ---
    // In a real app, you'd use the Coinbase Facilitator or your own logic
    // to verify the transaction hash in the `paymentHeader`.
    // For the hackathon, we'll assume the payment is valid if the header exists.
    console.log('Payment header received, proceeding to generate proof...');

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }

    const proof = await generateZkp(report);

    // Save the proof and return it
    report.zkProof = proof;
    await report.save();

    res.json({
      message: 'Proof generated successfully.',
      reportId: report._id,
      proof: proof,
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;
