### AWS SAM Commands

1. **sam validate** <br/> this command will validate the infrastructure code i,e .yaml file.
2. **sam build** <br/> this command will create an build file.
3. **sam local invoke TaskHubLambdaFunction --event events/event.json --log-file sam-log.txt**<br/> This command will execute the lambda function(TaskHubLambdaFunction) locally with docker.
4. **sam init** <br/> initlise the sam project
5. **sam deploy --guided --profile profile-name** <br/> this command will deploy the build file which is created using sam build command and you can verify the change after successfull deployment
6. **aws sso login --profile profile-name** <br/> login to the aws via cli way
