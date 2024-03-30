const transformPricesAndClients = (bestPricesAndClientsData, clients) => {
  const bestClients = bestPricesAndClientsData.reduce((result, currentData) => {
    const clientId = currentData['Contract.ClientId'];
    const client = clients.find(currentClient => currentClient.id === clientId);
    const clientFullName = client.firstName + ' ' + client.lastName;

    return [
      ...result,
      { id: clientId, fullName: clientFullName, paid: currentData.total }
    ];
  }, []);

  return bestClients;
};

module.exports = { transformPricesAndClients };
