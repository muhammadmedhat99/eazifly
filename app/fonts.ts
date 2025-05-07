import { IBM_Plex_Sans_Arabic } from 'next/font/google'

export const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'], // Specify the weights you need
  variable: '--font-ibm-plex-sans-arabic', // optional for CSS variables
})