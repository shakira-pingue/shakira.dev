terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "shakira-dev-tf-state"
    key            = "prod/terraform.tfstate"
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