const uuid = require('uuid')
const OperatorQueries = require('../RentHeroDB/Queries/OperatorQueries')

exports.get_operators = (req, res, next) => {
  OperatorQueries.get_all_operators()
    .then((data) => {
      res.json(data.rows)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send('Failed to get operators.')
    })
}

exports.insert_operator = (req, res, next) => {
  const info = req.body
  const operator_id = uuid.v4()

  OperatorQueries.create_operator(operator_id, info.email, info.agent_id)
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send('Failed to create operator')
    })
}

exports.select_operator_for_intelligence = (req, res, next) => {
  const info = req.body

  const arrayOfPromises = info.operators.map((op_id) => {
    return OperatorQueries.select_operator_for_intelligence(info.agent_id, op_id)
  })

  Promise.all(arrayOfPromises)
    .then((data) => {
      res.json({
        message: `Successfully added ${info.operators.length} operators to intelligence group`
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send(err)
    })
}
