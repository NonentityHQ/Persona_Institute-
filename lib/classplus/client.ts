import {
  type BrandConfig,
  type BrandId,
  brands,
  classplusCourseUrl,
  isBrandConfigured,
} from './brands';

export type ClassplusCourse = {
  id: string;
  brandId: BrandId;
  title: string;
  description: string;
  price: number;
  finalPrice: number;
  discountPercent?: number;
  imageUrl: string;
  enrollUrl: string;
  isFree?: boolean;
  subscriberCount?: number;
};

/** Build the base64 token Classplus store uses for preview APIs */
function previewToken(orgId: number): string {
  const payload = JSON.stringify({ tutorId: null, orgId, categoryId: null });
  return Buffer.from(payload).toString('base64');
}

/**
 * Fetch public course list for one brand from Classplus preview API.
 * Server-side only (uses Node Buffer + no CORS issues).
 */
export async function fetchBrandCourses(brand: BrandConfig): Promise<ClassplusCourse[]> {
  if (!isBrandConfigured(brand) || !brand.orgId) {
    return [];
  }

  const token = previewToken(brand.orgId);
  const url = `https://api.classplusapp.com/v2/course/preview/diy/similar/${token}?subCatList=[]&mainCategory=0`;

  try {
    const originBase =
      brand.storeBaseUrl?.replace(/\/$/, '') ||
      `https://${brand.orgCode}.courses.store`;
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        Origin: originBase,
        Referer: `${originBase}/`,
        'User-Agent': 'Mozilla/5.0 (compatible; PersonaInstituteBot/1.0)',
      },
      // Cache on our edge for 5 minutes
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.warn(`[classplus] ${brand.id} preview failed:`, res.status);
      return [];
    }

    const json = (await res.json()) as {
      status?: string;
      data?: {
        all?: { coursesData?: RawCourse[] };
        popular?: { coursesData?: RawCourse[] };
        featured?: { coursesData?: RawCourse[] };
      };
    };

    if (json.status !== 'success' || !json.data) return [];

    const raw =
      json.data.all?.coursesData ||
      json.data.popular?.coursesData ||
      json.data.featured?.coursesData ||
      [];

    return raw
      .filter((c) => c && !c.isHidden && c.isPublished !== false)
      .map((c) => mapCourse(c, brand));
  } catch (e) {
    console.warn(`[classplus] ${brand.id} fetch error`, e);
    return [];
  }
}

type RawCourse = {
  id?: number | string;
  name?: string;
  description?: string;
  courseDescription?: string;
  imageUrl?: string;
  price?: number;
  finalPrice?: number;
  discountPercentage?: number;
  isFreeCourse?: boolean;
  isHidden?: boolean;
  isPublished?: boolean;
  totalSubscriberCount?: number;
  singlePaymentLink?: string;
  shareableLink?: string;
};

function mapCourse(c: RawCourse, brand: BrandConfig): ClassplusCourse {
  const id = String(c.id ?? '');
  const enrollUrl =
    c.singlePaymentLink ||
    c.shareableLink ||
    classplusCourseUrl(brand, id) ||
    `https://${brand.orgCode}.courses.store/${id}`;

  return {
    id,
    brandId: brand.id,
    title: c.name || 'Course',
    description: c.description || c.courseDescription || '',
    price: Number(c.price) || 0,
    finalPrice: Number(c.finalPrice ?? c.price) || 0,
    discountPercent: c.discountPercentage,
    imageUrl: c.imageUrl || '/images/course-recorded.jpg',
    enrollUrl,
    isFree: Boolean(c.isFreeCourse) || Number(c.finalPrice) === 0,
    subscriberCount: c.totalSubscriberCount,
  };
}

/** Fetch both brands and merge (Persona first, then Khushi) */
export async function fetchAllBrandCourses(): Promise<ClassplusCourse[]> {
  const [persona, khushi] = await Promise.all([
    fetchBrandCourses(brands.persona),
    fetchBrandCourses(brands.khushi),
  ]);
  return [...persona, ...khushi];
}

/**
 * When org codes / org IDs are not set yet, return empty and let UI use fallbacks.
 * Call this from server components only.
 */
export function classplusReady(): boolean {
  return isBrandConfigured(brands.persona) || isBrandConfigured(brands.khushi);
}

/** Find one course by Classplus id across all brands */
export async function fetchCourseById(id: string): Promise<ClassplusCourse | null> {
  if (!id) return null;
  const all = await fetchAllBrandCourses();
  return all.find((c) => c.id === id) ?? null;
}

/** INR helper shared by list / home / detail */
export function formatInr(n: number) {
  return `₹${Number(n || 0).toLocaleString('en-IN')}`;
}

/** Map Classplus course → home card shape (lib/data Course-compatible) */
export function toHomeCourse(c: ClassplusCourse, index = 0) {
  const tags = ['Live Classes', 'Recorded', 'Special Batch', 'New Live Course', 'Bestseller', 'Fast Track'];
  const plain = (c.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const subtitle =
    plain.length > 90 ? plain.slice(0, 90).replace(/\s+\S*$/, '') + '…' : plain || 'Learn with Persona Institute';

  return {
    id: c.id,
    title: c.title,
    subtitle,
    price: c.isFree ? 0 : c.finalPrice,
    priceLabel: c.isFree ? 'Free' : undefined,
    oldPrice: c.price > c.finalPrice ? c.price : undefined,
    image: c.imageUrl || '/images/course-recorded.jpg',
    tag: tags[index % tags.length],
    description: plain || c.title,
    duration: c.brandId === 'khushi' ? 'English with Khushi' : 'Persona English',
    enrollUrl: c.enrollUrl,
  };
}

/** Map Classplus course → detail page shape */
export function toCourseDetail(c: ClassplusCourse) {
  const plain = (c.description || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const hasDiscount = c.price > c.finalPrice && c.finalPrice >= 0;
  const features =
    c.brandId === 'khushi'
      ? ['Practice Sessions', 'Notes', 'Flexible timing', 'Certificate']
      : ['Live / Recorded Classes', 'Practice Support', 'PDF Notes', 'Doubt Support'];

  return {
    id: c.id,
    title: c.title,
    image: c.imageUrl || '/images/course-recorded.jpg',
    tag: c.isFree ? 'Free' : hasDiscount ? 'Offer' : 'Course',
    price: c.isFree ? 'Free' : formatInr(c.finalPrice),
    old: hasDiscount ? formatInr(c.price) : '',
    duration: c.brandId === 'khushi' ? 'English with Khushi' : 'Persona English',
    description: plain || 'Course details from Classplus. Confirm batch timing and inclusions with the institute.',
    features,
    enrollUrl: c.enrollUrl,
  };
}
