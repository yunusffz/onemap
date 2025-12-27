import type { ListCategory } from "@/types/category";
import type { ListMapset, Mapset } from "@/types/mapset";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchCategories(): Promise<ListCategory> {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  return response.json();
}

export async function fetchMapsets(
  categoryId: string,
  filters: {
    is_active?: boolean;
    status_validation?: string;
  } = {}
): Promise<ListMapset> {
  const filterArray = [
    `category_id=${categoryId}`,
    `is_active=${filters.is_active ?? true}`,
    `status_validation=${filters.status_validation ?? "approved"}`,
  ];

  const params = new URLSearchParams({
    filter: JSON.stringify(filterArray),
  });

  const response = await fetch(`${API_URL}/mapsets?${params.toString()}`);
  if (!response.ok) {
    throw new Error("Failed to fetch mapsets");
  }
  return response.json();
}

export async function fetchMapsetDetail(id: string): Promise<Mapset> {
  const response = await fetch(`${API_URL}/mapsets/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch mapset details");
  }
  return response.json();
}
