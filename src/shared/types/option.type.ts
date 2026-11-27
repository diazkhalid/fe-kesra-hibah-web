export interface GrantDocumentOptionType {
  document_type: string;
  display_name: string;
  is_required: boolean;
  allowed_mime_types: string[];
  max_file_size_bytes: number;
}

export interface Pagination {
  limit: number;
  rows_per_page: number;
  page: number;
  total: number;
  total_pages: number;
}
