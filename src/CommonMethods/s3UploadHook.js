// import { useState } from "react";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import uuid from "react-uuid";

// const useS3Upload = () => {
//   const [uploading, setUploading] = useState(false);
//   const [error, setError] = useState(null);

//   const uploadImage = async (file, path) => {
//     setUploading(true);
//     setError(null);

//     // Initialize S3 client with your AWS credentials and region
//     const s3 = new S3Client({
//       region: import.meta.env.VITE_REGION, // Replace with your AWS region (e.g., 'us-east-1')
//       credentials: {
//         accessKeyId: import.meta.env.VITE_ACCESS_KEY, // Replace with your access key
//         secretAccessKey: import.meta.env.VITE_SECRET_KEY, // Replace with your secret access key
//       },
//     });

//     // Generate a unique key for the image
//     const key = ${path}/${uuid()}-${file.name};

//     try {
//       // Prepare the S3 put object command
//       const uploadParams = {
//         Bucket: "YOUR_BUCKET_NAME", // Replace with your S3 bucket name
//         Key: key,
//         Body: file,
//         ContentType: file.type, // Set the content type based on the file
//         ACL: "public-read", // Set the access control level
//       };

//       // Execute the S3 upload command
//       const command = new PutObjectCommand(uploadParams);
//       await s3.send(command);

//       setUploading(false);
//       return key; // Return the S3 key of the uploaded file
//     } catch (err) {
//       setError(err.message);
//       setUploading(false);
//       console.error("Error uploading file:", err);
//     }
//   };

//   return { uploadImage, uploading, error };
// };

// export default useS3Upload;