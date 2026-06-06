variable "aws_region" {
  description = "AWS Region"
  type        = string
  default     = "eu-west-2"
}

variable "aws_profile" {
  description = "AWS CLI Profile"
  type        = string
  default     = "development_shaka-london"
}

variable "domain_name" {
  description = "Domain Name"
  type        = string
}

variable "project_name" {
  description = "Project Name"
  type        = string
  default     = "shakira-dev"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}