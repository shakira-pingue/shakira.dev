output "certificate_arn" {
  description = "SSL Certificate ARN"
  value       = aws_acm_certificate_validation.cert.certificate_arn
}

output "hosted_zone_id" {
  description = "Route 53 Hosted Zone ID"
  value       = aws_route53_zone.main.zone_id
}

output "name_servers" {
  description = "Name Servers"
  value       = aws_route53_zone.main.name_servers
}