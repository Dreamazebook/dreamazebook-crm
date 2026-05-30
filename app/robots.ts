import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/private/',
          '/*.json$',
          '/*?*sort=',
          '/*?*filter=',
          '/checkout',
          '/shopping-cart',
          '/order-summary',
          '/login',
          '/reset-password',
          '/profile',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/api/', '/admin/', '/private/', '/checkout'],
      },
    ],
    sitemap: 'https://dreamazebook.com/sitemap.xml',
  };
}
