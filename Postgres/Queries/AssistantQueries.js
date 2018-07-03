const Promise = require('bluebird')
const { promisify } = Promise
const pool = require('../db_connect')
const uuid = require('uuid')

// to run a query we just pass it to the pool
// after we're done nothing has to be taken care of
// we don't have to return any client to the pool or close a connection

const query = promisify(pool.query)

exports.get_assistant_profile = (assistant_id) => {
  const p = new Promise((res, rej) => {
    const values = [assistant_id]

    const getAssistant = `SELECT * FROM assistants WHERE assistant_id = $1`

    query(getAssistant, values, (err, results) => {
      if (err) {
        console.log(err)
        rej(err)
      }
      res(results)
    })
  })
  return p
}

exports.insert_assistant_profile = (assistant_id, profile) => {
  const p = new Promise((res, rej) => {
    const values = [assistant_id, profile.first_name, profile.last_name, profile.email]

    const insertProfile = `INSERT INTO assistants (assistant_id, first_name, last_name, email) VALUES ($1, $2, $3, $4)`

    query(insertProfile, values, (err, results) => {
      if (err) {
        console.log(err)
        rej(err)
      }
      res('success')
    })

  })
  return p
}
