const Promise = require('bluebird')
const { promisify } = Promise
const pool = require('../db_connect')
const uuid = require('uuid')

// to run a query we just pass it to the pool
// after we're done nothing has to be taken care of
// we don't have to return any client to the pool or close a connection

const query = promisify(pool.query)

exports.get_all_ads = () => {
  const p = new Promise((res, rej) => {
    const getAds = `SELECT a.ad_id, a.ad_title, a.ad_unit, a.ad_type, a.ad_desc,
                           a.active, a.created_at, a.updated_at,
                           c.corporation_id, c.corporation_name,
                           d.formatted_address, d.gps_x, d.gps_y, d.place_id,
                           e.links,
                           f.imgs,
                           g.begin_date, g.end_date,
                           h.pricing,
                           i.amenities,
                           j.reviewer_emails, j.cc_emails
                       FROM advertisements a
                      INNER JOIN ad_to_corp b
                        ON a.ad_id = b.ad_id
                      INNER JOIN corporation c
                        ON b.corporation_id = c.corporation_id
                      INNER JOIN address d
                        ON a.address_id = d.address_id
                      LEFT OUTER JOIN (
                        SELECT ad_id, JSON_AGG(JSON_BUILD_OBJECT('link_id', link_id, 'link', link)) AS links
                          FROM advertisement_links
                        GROUP BY ad_id
                      ) e
                      ON a.ad_id = e.ad_id
                      LEFT OUTER JOIN (
                       SELECT ad_id, JSON_AGG(image_url ORDER BY position) AS imgs
                         FROM images
                        GROUP BY ad_id
                     ) f
                     ON a.ad_id = f.ad_id
                     LEFT OUTER JOIN advertisement_period g
                     ON a.ad_id = g.ad_id
                     LEFT OUTER JOIN (
                       SELECT ad_id, JSON_BUILD_OBJECT('price', price, 'period', period, 'negotiable', negotiable) AS pricing
                         FROM advertisement_price
                     ) h
                     ON a.ad_id = h.ad_id
                     LEFT OUTER JOIN (
                       SELECT ad_id, JSON_AGG(JSON_BUILD_OBJECT('amenity_id', amenity_id, 'title', title, 'type', type, 'meta', meta, 'updated_at', updated_at)) AS amenities
                         FROM amenities
                         GROUP BY ad_id
                     ) i
                     ON a.ad_id = i.ad_id
                     LEFT OUTER JOIN ad_supervision_settings j
                     ON a.ad_id = j.ad_id
                    `

    query(getAds, (err, results) => {
      if (err) {
        console.log(err)
        rej(err)
      }
      res(results)
    })
  })
  return p
}
