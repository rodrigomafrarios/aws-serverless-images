data "aws_caller_identity" "current" {}

module "images" {
  source = "../../infra/images"
  env    = var.env
}