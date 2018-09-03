const bodyParser = require('body-parser')

// security
const Google_JWT_Check = require('./auth/googleJWTCheck').Google_JWT_Check
const originCheck = require('./auth/originCheck').originCheck

// routes
const Test = require('./routes/test_routes')
const AdminRoutes = require('./routes/admin_routes')

const AdsRoutes = require('./routes/ads_routes')
const AgentsRoutes = require('./routes/agents_routes')
const OperatorRoutes = require('./routes/operator_routes')

// const GoogleRoutes = require('./routes/google_routes')
// const UserRoutes = require('./routes/user_routes')
const CorpRoutes = require('./routes/corp_routes')
// const EmailRoutes = require('./routes/email_routes')
// const UserQueries = require('./Postgres/Queries/UserQueries')

// bodyParser attempts to parse any request into JSON format
const json_encoding = bodyParser.json({type:'*/*'})
// bodyParser attempts to parse any request into GraphQL format
// const graphql_encoding = bodyParser.text({ type: 'application/graphql' })

module.exports = function(app){

	// tests
	app.get('/test', json_encoding, Test.test)

	// admin routes
	app.post('/retrieve_admin_profile', [json_encoding, originCheck, Google_JWT_Check], AdminRoutes.retrieve_admin_profile)

	// assistant routes
	app.post('/get_agents', [json_encoding, originCheck, Google_JWT_Check], AgentsRoutes.get_agents)
	app.post('/insert_agent', [json_encoding, originCheck, Google_JWT_Check], AgentsRoutes.insert_agent)

	// operator routes
	app.post('/get_operators', [json_encoding, originCheck, Google_JWT_Check], OperatorRoutes.get_operators)
	app.post('/insert_operator', [json_encoding, originCheck, Google_JWT_Check], OperatorRoutes.insert_operator)
	app.post('/select_operator_for_intelligence', [json_encoding, originCheck, Google_JWT_Check], OperatorRoutes.select_operator_for_intelligence)
	app.post('/remove_operator_from_intelligence', [json_encoding, originCheck, Google_JWT_Check], OperatorRoutes.remove_operator_from_intelligence)

	// ads routes
	app.post('/get_ads', [json_encoding, originCheck, Google_JWT_Check], AdsRoutes.get_ads)

	// app.post('/auth_test', [json_encoding, originCheck, Google_JWT_Check], Test.auth_test)
	//
	// // auth
	// app.post('/initial_google_auth', [json_encoding, originCheck, Google_JWT_Check], GoogleRoutes.initial_google_auth)
	// app.post('/retrieve_staff_profile', [json_encoding, originCheck, Google_JWT_Check], UserQueries.retrieve_staff_profile)
	// app.post('/watch_route', [json_encoding, originCheck], EmailRoutes.watch_route)
	//
	// // corp
	app.post('/get_all_corporations', [json_encoding, originCheck, Google_JWT_Check], CorpRoutes.get_all_corporations)
	// app.post('/create_corporation', [json_encoding, originCheck, Google_JWT_Check], CorpRoutes.create_corporation)

	// email
	// app.post('/get_recent_emails', [json_encoding, originCheck], EmailRoutes.get_recent_emails)
	// app.post('/pull_changes', [json_encoding, originCheck], EmailRoutes.pull_changes)
	// app.post('/get_email', [json_encoding, originCheck], EmailRoutes.get_email)
	// app.post('/get_threads', [json_encoding, originCheck], EmailRoutes.get_threads)
	// app.post('/get_thread', [json_encoding, originCheck], EmailRoutes.get_thread)
}
