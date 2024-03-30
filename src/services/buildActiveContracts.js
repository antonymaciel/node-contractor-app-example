const sequelize = require('sequelize');

const buildActiveContracts = async (Contract, profileId) => {
  const contracts = await Contract.findAll({
    where: sequelize.and(
      sequelize.or({ ClientId: profileId }, { ContractorId: profileId }),
      sequelize.or({ status: 'new' }, { status: 'in_progress' })
    )
  });

  return contracts;
};

module.exports = { buildActiveContracts };
