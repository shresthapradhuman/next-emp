const config = {
  nodeEnv: process.env.NODE_ENV,
  databaseUrl: process.env.DATABASE_URL,
  resendApiKey: process.env.RESEND_API_KEY,
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL!,
  cloudinary: {
    name: process.env.CLOUDINARY_CLOUD_NAME!,
    key: process.env.CLOUDINARY_API_KEY!,
    secret: process.env.CLOUDINARY_API_SECRET!,
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY!,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY!,
  },
}
export default config
