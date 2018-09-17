const Promise = require('bluebird')
const { promisify } = Promise
const pool = require('../db_connect')
const uuid = require('uuid')

// to run a query we just pass it to the pool
// after we're done nothing has to be taken care of
// we don't have to return any client to the pool or close a connection

const query = promisify(pool.query)

exports.get_all_proxies = () => {
  const p = new Promise((res, rej) => {
    const queryString = `SELECT a.proxy_id, a.corporation_id, a.proxy_email, a.proxy_phone,
                                b.agents,
                                c.corporation_name
                           FROM corporation_proxy a
                           INNER JOIN (
                             SELECT ab.proxy_id, JSON_AGG(JSON_BUILD_OBJECT(
                                                    'agent_id', bc.agent_id,
                                                    'friendly_name', bc.friendly_name,
                                                    'email', bc.email,
                                                    'actual_email', bc.actual_email
                                                  )) AS agents
                               FROM proxies_to_intelligence_groups ab
                               INNER JOIN agents bc
                               ON ab.agent_id = bc.agent_id
                               WHERE ab.agent_id = bc.agent_id
                               GROUP BY ab.proxy_id
                           ) b
                           ON a.proxy_id = b.proxy_id
                           INNER JOIN corporation c
                           ON a.corporation_id = c.corporation_id
                          `

      query(queryString, (err, results) => {
        if (err) {
          console.log(err)
          rej(err)
        }
        res(results.rows)
      })
  })
  return p
}

exports.save_proxy_to_int_group = (proxy_id, agent_id) => {
  const p = new Promise((res, rej) => {
    const values = [proxy_id, agent_id]
    const queryString = `INSERT INTO proxies_to_intelligence_groups (proxy_id, agent_id)
                                VALUES ($1, $2)
                                ON CONFLICT (proxy_id, agent_id)
                                DO NOTHING
                        `

    query(queryString, values, (err, results) => {
      if (err) {
        console.log(err)
        rej(err)
      }
      res({
        message: 'Successfully added proxy to intelligence groupa'
      })
    })
  })
  return p
}


exports.remove_proxy_from_int_group = (proxy_id, agent_id) => {
  const p = new Promise((res, rej) => {
    const values = [proxy_id, agent_id]
    const queryString = `DELETE FROM proxies_to_intelligence_groups
                            WHERE proxy_id = $1 AND agent_id = $2
                        `

    query(queryString, values, (err, results) => {
      if (err) {
        console.log(err)
        rej(err)
      }
      res({
        message: 'Successfully removed proxy from intelligence group'
      })
    })
  })
  return p
}
