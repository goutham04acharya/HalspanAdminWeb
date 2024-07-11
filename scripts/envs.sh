parameter_names=(
    "DOMAIN_NAME"
    "CDN_URL"
    "ADMIN_COGNITO_IDENTITY_POOL_ID"
    "ADMIN_COGNITO_USERPOOL_ID"
    "BUCKET_NAME"
    "ADMIN_COGNITO_CLIENT_ID"
    "ADMIN_DISTRIBUTION_ID"
    "ADMIN_S3_BUCKET"
    "COMMON_LIB_ARN_PYTHON_2"
)
# Loop through each parameter
for param_name in "${parameter_names[@]}"; do
    echo "$param_name"
    # Get parameter value
    param_value=$(aws ssm get-parameter --name "$param_name" --query "Parameter.Value" --output text --region $AWS_REGION)

    # Append to .env file
    echo "${param_name##*/}=$param_value" >> .env  # Write key-value pair to .env file
    echo "VITE_${param_name##*/}=$param_value" >> .env  # Write key-value pair to .env file
done