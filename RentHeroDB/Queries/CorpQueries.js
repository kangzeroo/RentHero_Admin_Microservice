const Promise = require('bluebird')
const { promisify } = Promise
const pool = require('../db_connect')
const uuid = require('uuid')

// to run a query we just pass it to the pool
// after we're done nothing has to be taken care of
// we don't have to return any client to the pool or close a connection

const query = promisify(pool.query)

exports.get_all_corporations = () => {
  const p = new Promise((res, rej) => {
    const queryString = `SELECT a.corporation_id, a.corporation_name, a.created_at, a.updated_at,
                                b.ad_ids, c.staffs, d.proxies
                           FROM corporation a
                           LEFT OUTER JOIN (
                             SELECT corporation_id, JSON_AGG(ad_id) AS ad_ids
                              FROM ad_to_corp
                              GROUP BY corporation_id
                           ) b
                            ON a.corporation_id = b.corporation_id
                           LEFT OUTER JOIN (
                             SELECT ab.corporation_id,
                                    JSON_AGG(JSON_BUILD_OBJECT('staff_id', ab.staff_id,
                                                               'first_name', bc.first_name,
                                                               'last_name', bc.last_name,
                                                               'email', bc.email,
                                                               'phone', bc.phone,
                                                               'title', bc.title,
                                                               'thumbnail', bc.thumbnail,
                                                               'updated_at', bc.updated_at,
                                                               'created_at', bc.created_at)
                                             ) AS staffs
                               FROM corporation_staff ab
                               LEFT OUTER JOIN staff bc
                               ON ab.staff_id = bc.staff_id
                             GROUP BY corporation_id
                           ) c
                            ON a.corporation_id = c.corporation_id
                          LEFT OUTER JOIN (
                            SELECT corporation_id, JSON_AGG(JSON_BUILD_OBJECT('proxy_id', proxy_id,
                                                                              'corporation_id', corporation_id,
                                                                              'proxy_email', proxy_email,
                                                                              'proxy_phone', proxy_phone)) AS proxies
                              FROM corporation_proxy
                              GROUP BY corporation_id
                          ) d
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
