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
    const getAgents = `SELECT a.agent_id, a.friendly_name, a.email, a.phone, a.actual_email, a.created_at, a.updated_at,
                              b.operator_ids, c.proxies
                         FROM agents a
                         LEFT OUTER JOIN (
                           SELECT agent_id, JSON_AGG(operator_id) AS operator_ids
                             FROM agents_to_operators
                            GROUP BY agent_id
                         ) b
                          ON a.agent_id = b.agent_id
                        LEFT OUTER JOIN (
                          SELECT ab.agent_id, JSON_AGG(JSON_BUILD_OBJECT('proxy_id', bc.proxy_id,
                                                                         'corporation_id', bc.corporation_id,
                                                                         'proxy_email', bc.proxy_email,
                                                                         'proxy_phone', bc.proxy_phone )) AS proxies
                            FROM proxies_to_intelligence_groups ab
                            INNER JOIN corporation_proxy bc
                            ON ab.proxy_id = bc.proxy_id
                            GROUP BY ab.agent_id
                        ) c
                          ON a.agent_id = c.agent_id
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
    const tech_email = email.split('@')[0].concat(`.${uuid.v4()}${process.env.NODE_ENV === 'production' ? '@renthero.tech' : '@devagentemail.net'}`)
    const values = [agent_id, friendly_name, tech_email, email]

    const insertAgent = `INSERT INTO agents (agent_id, friendly_name, email, actual_email) VALUES ($1, $2, $3, $4)`

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

exports.update_agent = (agent_id, friendly_name, email, actual_email) => {
  const p = new Promise((res, rej) => {
    const values = [agent_id, friendly_name, email, actual_email]
    const queryString = `UPDATE agents
                            SET friendly_name = $2,
                                email = $3,
                                actual_email = $4,
                                updated_at = CURRENT_TIMESTAMP
                          WHERE agent_id = $1
                          RETURNING *
                        `

    query(queryString, values, (err, results) => {
      if (err) {
        console.log(err)
        rej('Failed to update intelligence group')
      }
      res({
        message: 'Successfully updated intelligence group',
        agent: results.rows[0]
      })
    })
  })
  return p
}
