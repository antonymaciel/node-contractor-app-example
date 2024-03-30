const sequelize = require('sequelize');

const getBestPriceByAgregator = (
  Job,
  Contract,
  agregator,
  from,
  to,
  limit = 1
) =>
  Job.findAll({
    attributes: [[sequelize.fn('sum', sequelize.col('price')), 'total']],
    where: {
      paid: true,
      ...(from || to
        ? {
            paymentDate: {
              ...(from && !to ? { [sequelize.Op.gt]: from } : {}),
              ...(!from && to ? { [sequelize.Op.lt]: to } : {}),
              ...(from && to ? { [sequelize.Op.between]: [from, to] } : {})
            }
          }
        : {})
    },
    include: [
      {
        model: Contract
      }
    ],
    group: agregator,
    raw: true,
    order: sequelize.literal('total DESC'),
    limit
  });

module.exports = { getBestPriceByAgregator };
