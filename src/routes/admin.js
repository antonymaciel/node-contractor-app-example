const express = require('express');
const router = new express.Router();
const {
  getBestPriceByAgregator
} = require('../services/getBestPriceByAgregator');
const {
  transformPricesAndClients
} = require('../services/transformPricesAndClients');

/**
 * @returns Best Profession based on payment
 */
router.get('/best-profession', async (req, res, next) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const { start, end } = req.query;

  try {
    const result = await getBestPriceByAgregator(
      Job,
      Contract,
      'ContractorId',
      start,
      end
    );

    if (result.length === 0) {
      return res.json({});
    }

    const contractorId = result[0]['Contract.ContractorId'];
    const totalGain = result[0].total;
    const contractor = await Profile.findOne({
      where: { id: contractorId }
    });

    return res.json({ profession: contractor.profession, totalGain });
  } catch (error) {
    next(error);
  }
});

/**
 * @returns Best Clients based on payment
 */
router.get('/best-clients', async (req, res, next) => {
  const { Contract, Job, Profile } = req.app.get('models');
  const { start, end, limit } = req.query;

  try {
    const bestPricesAndClientsData = await getBestPriceByAgregator(
      Job,
      Contract,
      'ClientId',
      start,
      end,
      limit || 2
    );

    const clientsIds = bestPricesAndClientsData.map(
      result => result['Contract.ClientId']
    );

    const clients = await Profile.findAll({ where: { id: clientsIds } });

    const bestClients = transformPricesAndClients(
      bestPricesAndClientsData,
      clients
    );

    return res.json(bestClients);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
