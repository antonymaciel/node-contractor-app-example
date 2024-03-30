const express = require('express');
const { buildUpaidJobs } = require('../services/buildUpaidJobs');
const { ERROR_MESSAGES } = require('../constants');
const router = new express.Router();

/**
 * Deposit in the balance of client
 */
router.post('/deposit/:userId', async (req, res, next) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const { userId } = req.params;
  const { deposit } = req.body;

  if (deposit < 0) {
    return res.status(400).send(ERROR_MESSAGES.balance.depositNotAllowed);
  }

  try {
    const jobs = await buildUpaidJobs(Contract, Job, userId);
    const totalJobPrice = jobs.reduce((totalPrice, job) => {
      return totalPrice + job.price;
    }, 0);

    if (deposit > (totalJobPrice * 25) / 100) {
      return res
        .status(400)
        .send(ERROR_MESSAGES.balance.maximumDepositExceeded);
    }

    const client = await Profile.findOne({ where: { id: userId } });

    const newBalance = client.balance + deposit;

    client.update({
      balance: newBalance
    });

    res.status(201).send(client);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
