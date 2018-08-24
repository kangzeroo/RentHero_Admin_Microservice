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
    const getAgents = `SELECT a.agent_id, a.first_name, a.last_name, a.email, a.phone, a.created_at, a.updated_at,
                              b.operator_ids
                         FROM agents a
                         LEFT OUTER JOIN (
                           SELECT agent_id, JSON_AGG(operator_id) AS operator_ids
                             FROM agents_to_operators
                            GROUP BY agent_id
                         ) b
                          ON a.agent_id = b.agent_id
                      `

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

exports.create_agent = (agent_id, friendly_name, email) => {
  const p = new Promise((res, rej) => {
    const values = [agent_id, friendly_name, email]

    const insertAgent = `INSERT INTO agents (agent_id, first_name, email) VALUES ($1, $2, $3)`

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

exports.get_all_operators = () => {
  const p = new Promise((res, rej) => {
    const queryString = `SELECT a.operator_id, a.first_name, a.last_name, a.email, a.phone, a.created_at, a.updated_at,
                                b.agent_ids
                           FROM operators a
                           LEFT OUTER JOIN (
                             SELECT operator_id, JSON_AGG(agent_id) AS agent_ids
                               FROM agents_to_operators
                              GROUP BY operator_id
                           ) b
                            ON a.operator_id = b.operator_id
                        `

    query(queryString, (err, results) => {
      if (err) {
        console.log(err)
        rej(err)
      }
      res(results)
    })
  })
  return p
}

exports.create_operator = (operator_id, email, agent_id) => {
  const p = new Promise((res, rej) => {
    query('BEGIN', (err) => {
      if (err) {
        console.log(err)
        rej(err)
      }
      const values = [operator_id, email]
      const queryString = `INSERT INTO operators (operator_id, email)
                                VALUES ($1, $2)
                             ON CONFLICT (email)
                             DO NOTHING
                             RETURNING *
                          `

      query(queryString, values, (err, results) => {
        if (err) {
          console.log(err)
          rej(err)
        }
        const op = results.rows[0]
        console.log('operator= ', op)
        const values2 = [op.operator_id, agent_id]
        const queryString2 = `INSERT INTO agents_to_operators (operator_id, agent_id)
                                   VALUES ($1, $2)
                                ON CONFLICT (agent_id, operator_id)
                                DO NOTHING
                            `

        query(queryString2, values2, (err, results) => {
          if (err) {
            console.log(err)
            rej(err)
          }

          query('COMMIT', (err) => {
            if (err) {
              console.log(err)
              rej(err)
            }
            res({
              message: 'Successfully created operator',
              operator_id,
            })
          })
        })
      })
    })
  })
  return p
}
