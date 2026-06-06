output "api_endpoint" {
  description = "API Gateway Endpoint URL"
  value       = aws_apigatewayv2_stage.api.invoke_url
}

output "lambda_function_name" {
  description = "Lambda Function Name"
  value       = aws_lambda_function.api.function_name
}