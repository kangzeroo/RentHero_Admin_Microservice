const Promise = require('bluebird')
const { promisify } = Promise
const pool = require('../db_connect')
const uuid = require('uuid')

// to run a query we just pass it to the pool
// after we're done nothing has to be taken care of
// we don't have to return any client to the pool or close a connection

const query = promisify(pool.query)

exports.get_all_agents = () => {
  const p = new Promise((res, rej) => {
    const getAgents = `SELECT * FROM agents`

    query(getAgents, (err, results) => {
      if (err) {
        console.log(err)
        rej(err)
      }
      res(results)
    })
  })
  return p
}

exports.create_agent = (agent_id, email) => {
  const p = new Promise((res, rej) => {
    const values = [agent_id, email]

    const insertAgent = `INSERT INTO agents (agent_id, email) VALUES ($1, $2)`

    query(insertAgent, values, (err, results) => {
      if (err) {
        console.log(err)
        rej(err)
      }
      res('Successfully gave agent access to Agent Portal')
    })

  })
  return p
}
