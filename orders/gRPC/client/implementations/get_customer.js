const client = require('../client');

function getCustomer(id) {
  let _customer = {};
  client.getCustomer({ id }, function (error, customer) {
    // console.log(id, '>>>')
    // console.log(customer, '>>>')
    if (error) throw Error(error);
    _customer = customer;
    console.log('Customer feched successfully', customer);
  });

  return _customer;
}

// getCustomer({ _id: '5ef921cb18483e58451a5718' })
module.exports = {
  getCustomer
}
