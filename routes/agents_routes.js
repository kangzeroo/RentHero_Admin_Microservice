const uuid = require('uuid')
const AgentsQueries = require('../RentHeroDB/Queries/AgentsQueries')

exports.get_agents = (req, res, next) => {

  AgentsQueries.get_all_agents()
    .then((agentData) => {
      res.json(agentData.rows)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send('Failed to get agents')
    })
}

exports.insert_agent = (req, res, next) => {
  const agent_id = uuid.v4()
  const friendly_name = req.body.friendly_name
  const agent_email = req.body.email

  AgentsQueries.create_agent(agent_id, friendly_name, agent_email)
    .then((message) => {
      res.json({
        message,
      })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send('Failed to insert agent')
    })
}

exports.get_operators = (req, res, next) => {
  AgentsQueries.get_all_operators()
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

  AgentsQueries.create_operator(operator_id, info.email, info.agent_id)
    .then((data) => {
      res.json(data)
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send('Failed to create operator')
    })
}
