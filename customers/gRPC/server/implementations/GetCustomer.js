// const { Customer } = require('../../../model/Customer');

// const CustomerClass = class {
//    constructor(payload) {
//       this.payload = payload;
//    }

//    static list(cb) {
//       const criteria = {};
//       const projections = {
//          _id: 0,
//          __v: 0
//       };
//       const options = {
//          lean: true
//       };
//       employeeModel.find(criteria, projections, options, cb);
//    }

//    add(cb) {
//       new employeeModel(this.payload).save(cb);
//    }

//    async fetch(cb) {
//       const criteria = this.payload.criteria;
//       const projections = this.payload.projections;
//       const options = this.payload.options;
//       // Customer.find(criteria, projections, options, cb)
//       await Customer.find(criteria, cb);
//    }

//    remove(cb) {
//       const criteria = this.payload;
//       employeeModel.remove(criteria, cb);
//    }
// };

// module.exports = CustomerClass;
