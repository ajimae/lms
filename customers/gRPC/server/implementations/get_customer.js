// var { Customer } = require('../../../model/Customer');
// // const Customer = require('./GetCustomer');

// function getCustomer(call, callback) {
//   const customer = Customer.findOne({ _id: call.request.id });
//   console.log(customer, '>>>');
//   if (customer) {
//     callback(null, customer)
//   } else {
//     callback({
//       code: grpc.status.NOT_FOUND,
//       details: "Not found"
//     });
//   }

// //   const payload = {
// //     criteria: {
// //       _id: call.request.id
// //     },
// //     projections: {
// //       _id: call.request.id, __v: 0
// //     },
// //     options: {
// //       lean: true
// //     }
// //   };
// //   const customer = new Customer(payload);
// //   customer.fetch(callback);
// }

// module.exports = {
//   getCustomer
// }
