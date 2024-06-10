## Cloud Deployment

Note that in attempting the following deoployments, the Dockerfiles would change
significantly.

- Frontend \
  This can be deployed to [Vercel](https://vercel.com/) since the client code is
  a Next.js application. Vercel provides automatic scaling and a global CDN. No
  Docker needed as well. Only concern is cost since Vercel is a wrapper around AWS.
- Backend \
  This can be deployed to [AWS Fargate](https://aws.amazon.com/fargate/) using
  the Docker orchestration. Fargate can be configured to provide automatic 
  scalability and the application can be monitored through 
  [AWS CloudWatch](https://aws.amazon.com/cloudwatch/). Finally, VPC rules can 
  be set up to maintain security.
- Database \
  This can be deployed using 
  [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database).
  This also can be configured for automatic scaling and in similar regions and
  similar platforms. Mongo also allows for setting up VPC rules to allow only our
  backend server to connect.
