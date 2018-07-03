const Promise = require('bluebird')
const { promisify } = Promise
const pool = require('../db_connect')
const uuid = require('uuid')

// to run a query we just pass it to the pool
// after we're done nothing has to be taken care of
// we don't have to return any client to the pool or close a connection

const query = promisify(pool.query)

exports.get_all_assistants = () => {
  const p = new Promise((res, rej) => {
    const getAssistants = `SELECT * FROM assistants`

    query(getAssistants, (err, results) => {
      if (err) {
        console.log(err)
        rej(err)
      }
      res(results)
    })
  })
  return p
}

exports.create_assistant = (assistant_id, email) => {
  const p = new Promise((res, rej) => {
    const values = [assistant_id, email]

    const insertAssistant = `INSERT INTO assistants (assistant_id, email) VALUES ($1, $2)`

    query(insertAssistant, values, (err, results) => {
      if (err) {
        console.log(err)
        rej(err)
      }
      res('Successfully gave assistant access to Assistant Portal')
    })

  })
  return p
}
