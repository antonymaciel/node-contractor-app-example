const express = require('express');
const { buildUpaidJobs } = require('../services/buildUpaidJobs');
const { ERROR_MESSAGES } = require('../constants');

const router = new express.Router();

/**
 * @returns all unpaid jobs for a user in active contracts
 */
router.get('/unpaid', async (req, res, next) => {
  const { Contract, Job } = req.app.get('models');
  const profileId = req.profile.id;

  try {
    const jobs = await buildUpaidJobs(Contract, Job, profileId);

    res.send(jobs);
  } catch (error) {
    next(error);
  }
});

/**
 * Pay a job of contractor
 */
router.post('/:jobId/pay', async (req, res, next) => {
  const { Job, Contract, Profile } = req.app.get('models');
  const sequelize = req.app.get('sequelize');
  const { jobId } = req.params;
  const profileId = req.profile.id;

  try {
    const job = await Job.findOne({ where: { id: jobId } });

    if (!job) return res.status(404).send(ERROR_MESSAGES.notFound);

    const contract = await Contract.findOne({ where: { id: job.ContractId } });
    const contractor = await Profile.findOne({
      where: { id: contract.ContractorId }
    });
    const client = await Profile.findOne({ where: { id: contract.ClientId } });

    if (client.id !== profileId) {
      return res.status(403).send(ERROR_MESSAGES.notAuthorized);
    }

    if (job.paid) return res.status(400).send(ERROR_MESSAGES.job.alreadyPaid);

    if (client.balance < job.price) {
      return res.status(400).send(ERROR_MESSAGES.job.insufficientBalance);
    }

    const newClientBalance = client.balance - job.price;
    const newContractorBalance = contractor.balance + job.price;

    const result = await sequelize.transaction(async t => {
      await client.update(
        {
          balance: newClientBalance
        },
        { transaction: t }
      );

      await contractor.update(
        {
          balance: newContractorBalance
        },
        { transaction: t }
      );

      await job.update(
        {
          paid: true,
          paymentDate: new Date()
        },
        { transaction: t }
      );

      return job;
    });

    res.status(201).send(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
