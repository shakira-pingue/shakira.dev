terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "shakira-dev-tf-state"
    key            = "dev/terraform.tfstate"
    region         = "eu-west-2"
    use_lockfile   = true
    profile        = "development_shaka-london"
  }
}

provider "aws" {
  region  = var.aws_region
  profile = var.aws_profile
}

provider "aws" {
  alias   = "us_east_1"
  region  = "us-east-1"
  profile = var.aws_profile
}

module "dns" {
  source = "../../modules/dns"

  providers = {
    aws.us_east_1 = aws.us_east_1
  }

  domain_name                = var.domain_name
  environment                = var.environment
  project_name               = var.project_name
  cloudfront_domain_name     = module.frontend.cloudfront_domain_name
  cloudfront_distribution_id = module.frontend.cloudfront_distribution_id
}

module "frontend" {
  source = "../../modules/frontend"

  domain_name     = var.domain_name
  project_name    = var.project_name
  environment     = var.environment
  certificate_arn = module.dns.certificate_arn
}

module "backend" {
  source = "../../modules/backend"

  project_name = var.project_name
  environment  = var.environment
  domain_name  = var.domain_name
}