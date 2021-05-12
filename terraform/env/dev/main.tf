data "aws_caller_identity" "dev" {}

module "images" {
  source = "../../infra/images"
  env    = var.env
  bucket_actions = var.bucket_actions
}