const { buildActiveContracts } = require('./buildActiveContracts');

const buildUpaidJobs = async (Contract, Job, profileId) => {
  const contracts = await buildActiveContracts(Contract, profileId);
  const contractIds = contracts.map(contract => contract.id);
  const jobs = await Job.findAll({
    where: { ContractId: contractIds, paid: null }
  });

  return jobs;
};

module.exports = { buildUpaidJobs };
