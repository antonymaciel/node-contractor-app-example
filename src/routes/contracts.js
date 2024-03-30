const express = require('express');
const { buildActiveContracts } = require('../services/buildActiveContracts');
const { ERROR_MESSAGES } = require('../constants');
const router = new express.Router();

/**
 * @returns contract by id
 */
router.get('/:id', async (req, res, next) => {
  const { Contract } = req.app.get('models');
  const { id } = req.params;
  const profileId = req.profile.id;

  try {
    const contract = await Contract.findOne({ where: { id } });

    if (!contract) return res.status(404).send(ERROR_MESSAGES.notFound);

    if (
      contract.ClientId !== profileId &&
      contract.ContractorId !== profileId
    ) {
      return res.status(403).send(ERROR_MESSAGES.notAuthorized);
    }

    res.json(contract);
  } catch (error) {
    next(error);
  }
});

/**
 * @returns active contracts
 */
router.get('/', async (req, res, next) => {
  const { Contract } = req.app.get('models');
  const profileId = req.profile.id;

  try {
    const contracts = await buildActiveContracts(Contract, profileId);

    res.json(contracts);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
