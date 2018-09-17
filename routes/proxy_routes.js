const ProxyQueries = require('../RentHeroDB/Queries/ProxyQueries')

exports.get_all_proxies = (req, res, next) => {

  ProxyQueries.get_all_proxies()
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send(err)
    })
}

exports.save_proxy_to_int_group = (req, res, next) => {
  const info = req.body

  ProxyQueries.save_proxy_to_int_group(info.proxy_id, info.agent_id)
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send(err)
    })
}

exports.remove_proxy_from_int_group = (req, res, next) => {
  const info = req.body

  ProxyQueries.remove_proxy_from_int_group(info.proxy_id, info.agent_id)
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send(err)
    })
}
