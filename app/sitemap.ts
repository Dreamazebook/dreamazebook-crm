import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://dreamazebook.com';
  const locales = ['en', 'fr', 'zh'];

  // Core static pages
  const staticPages = [
    '',
    '/books',
    '/about-us',
    '/faq',
    '/contact-us',
    '/delivery-information',
    '/terms-and-conditions',
    '/privacy-policy',
    '/return-policy',
    '/personalize',
    '/christmas',
    '/mothers-day',
  ];

  // Generate main entries with all languages
  const mainSitemap: MetadataRoute.Sitemap = staticPages.flatMap((page) =>
    locales.map((locale) => {
      const pagePath = page === '' ? '/' : page;
      return {
        url: `${baseUrl}/${locale}${pagePath}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority:
          page === ''
            ? 1.0
            : page === '/books'
              ? 0.9
              : page === '/personalize'
                ? 0.85
                : 0.8,
      };
    })
  );

  // Add book detail pages (these would typically be fetched from API)
  const bookIds = [
    'PICBOOK_GOODNIGHT3',
    'PICBOOK_GOODNIGHT',
    'PICBOOK_MOM',
    'PICBOOK_DAD',
    'PICBOOK_SANTA',
    'PICBOOK_BRAVEY',
    'PICBOOK_BIRTHDAY',
    'PICBOOK_MELODY',
  ];

  const bookSitemap: MetadataRoute.Sitemap = bookIds.flatMap((bookId) =>
    locales.map((locale) => ({
      url: `${baseUrl}/${locale}/books/${bookId}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  return [...mainSitemap, ...bookSitemap];
}
