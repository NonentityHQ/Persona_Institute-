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
