output "name_servers" {
  description = "AWS Name Servers"
  value       = module.dns.name_servers
}

output "website_url" {
  description = "Website URL"
  value       = "https://${var.domain_name}"
}

output "cloudfront_distribution_id" {
  description = "CloudFront Distribution ID"
  value       = module.frontend.cloudfront_distribution_id
}