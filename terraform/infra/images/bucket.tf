resource "aws_s3_bucket" "image-bucket" {
  bucket = "uploaded-images-${var.env}"
  acl = "private"
}
