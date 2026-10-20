import { apiFetch } from './client';
import type { Course } from '@/lib/data';

// Endpoint paths and response DTOs are placeholders until the backend contract is shared.
export function getCourses() { return apiFetch<Course[]>('/courses'); }
export function getCourseBySlug(slug: string) { return apiFetch<Course>(`/courses/${encodeURIComponent(slug)}`); }
