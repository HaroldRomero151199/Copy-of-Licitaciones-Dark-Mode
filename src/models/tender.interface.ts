
// API Response DTO from backend
export interface TenderSummaryDTO {
  id: string; // código externo (ej. "1002-11-LP26")
  title: string;
  description: string;
  entity: string; // organismo comprador
  region: string;
  comuna: string;
  type: string; // tipo de licitación (L1, LE, LP, etc.)
  status: string; // estado normalizado (open, closed, deserted, awarded, etc.)
  publishDate: string; // ISO 8601
  closingDate: string | null; // ISO 8601 o null
  currency: string; // por defecto CLP
  amount: number; // monto estimado (0.0 si no está disponible)
  montoDisplay: string; // texto legible del rango de monto
  complaintsLevel: string; // bajo, medio, alto
  complaintsCount: number;
  productsCount: number;
  url: string; // enlace directo a Mercado Público
  score: number; // puntaje de relevancia de Solr
}

// API Response wrapper
export interface SearchResponse {
  query: string;
  page: number;
  size: number;
  total: number;
  totalPages: number;
  items: TenderSummaryDTO[];
}

// Frontend model (mapped from API DTO)
export interface Tender {
  id: string; // Internal ID (UUID)
  codigoExterno: string; // MercadoPublico ID (from API's 'id')
  title: string;
  organization: string; // from API's 'entity'
  amount: number;
  currency: string;
  status: string; // mapped from API status
  publishDate: string;
  closingDate: string | null;
  matchScore?: number; // from API's 'score'
  montoDisplay?: string; // texto del rango de monto
  url?: string; // enlace directo a Mercado Público desde la API
  tags?: string[]; // deprecated, pero mantenido por compatibilidad
}
