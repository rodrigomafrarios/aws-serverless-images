data "aws_caller_identity" "dev" {}

module "images" {
  source = "../../infra/images"
  env    = var.env
  region = var.region
  bucket_actions = var.bucket_actions
  account_id = var.account_id
  authorizer_fn = var.authorizer_fn
}