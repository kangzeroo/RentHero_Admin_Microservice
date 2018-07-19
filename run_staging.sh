docker run --log-opt max-size=500m -d -it -p 7301:7301 --name=admin_microservice admin_microservice npm run staging -- --host=0.0.0.0
