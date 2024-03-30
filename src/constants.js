const ERROR_MESSAGES = {
  notFound: 'Not Found',
  notAuthorized: 'Not Authorized',
  internalError: 'Internal Server Error',
  job: {
    alreadyPaid: 'Job already paid',
    insufficientBalance: 'Insufficient balance'
  },
  balance: {
    maximumDepositExceeded: 'Maximum deposit exceeded',
    depositNotAllowed: 'Deposit not allowed'
  }
};

module.exports = { ERROR_MESSAGES };
