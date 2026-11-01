/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // The old résumé address, still out there in shared links
  async redirects() {
    return [{ source: "/clg_resume_v3.pdf", destination: "/Ashish_Nagmoti_Resume.pdf", permanent: true }]
  },
}

export default nextConfig
