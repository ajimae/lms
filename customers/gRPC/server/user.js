const _ = require('lodash')
const hl = require('highland')
const JSONStream = require('JSONStream')
const axios = require('axios')
const { Customer } = require('../../model/Customer');

class User {
  constructor(props) {
    _.forOwn(props, (v, k) => { this[k] = v })
  }

  toObject() {
    const ret = {}
    _.forOwn(this, (v, k) => { ret[k] = v })
    return _.cloneDeep(ret)
  }

  // toJSON() {
  //   const ret = this.toObject()
  //   delete ret.password

  //   if (this.metadata) {
  //     ret.metadata = new Buffer(JSON.stringify(this.metadata))
  //   }

  //   if (this.dateOfBirth instanceof Date) {
  //     ret.dateOfBirth = this.dateOfBirth.toISOString()
  //   }

  //   return ret
  // }

  static async findById(id) {
    /**
     * Once you introduce this database action the request is never released out to the response processing
     */
    // console.log(id, '>>>');
    // const customer = await Customer.findOne({ _id: id })

    const { data } = await axios({
      method: 'get',
      url: `http://localhost:5555/customer/${id}`,
    })
    // .then(data => {
    //   console.log(data.data, '<><><><><><>')
    // })
    console.log(data, '>>><<<')
    /**
     * This works perfectly when
     * you are writing to file but
     * breaks when trying to perform database operations
     */

    // hl(input)
    //   .through(JSONStream.parse('*'))
    //   .find(u => u.id === id)
    //   .toCallback((err, data) => {
    //     if (err) {
    //       return reject(err)
    //     }
    //     resolve(new User(data))
    //   })

    /**
     * This also works very fine
     */
    return data.data
    // return Promise.resolve({ name: 'a', age: 3, address: 'Lagos' })
    // return Promise.resolve(customer); // This doesn't work
  }
}

module.exports = User
