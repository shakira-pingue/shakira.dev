variable "domain_name" {
  description = "Domain Name"
  type        = string
}

variable "project_name" {
  description = "Project Name"
  type        = string
}

variable "environment" {
  description = "Environment"
  type        = string
}

variable "certificate_arn" {
  description = "SSL certificate ARN from ACM"
  type        = string
}