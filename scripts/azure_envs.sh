parameter_names=(
    "DOMAIN_NAME"
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

printenv | awk -F= '/^REGION|^STAGE|^AUTH0_CLIENT_ID|^AUTH0_API_DOMAIN/ {printf "VITE_%s:%s\n", $1, $2}' >> .env