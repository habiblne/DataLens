export type JsonValue = string | number | boolean | null;
export type DataRecord = Record<string, JsonValue>;

export type DatasetSummary = {
  numeric_columns: string[];
  categorical_columns: string[];
  datetime_columns: string[];
  missing_values: Record<string, number>;
};

export type UploadResponse = {
  dataset_id: string;
  file_name: string;
  rows: number;
  columns: number;
  column_names: string[];
  dtypes: Record<string, string>;
  preview: DataRecord[];
  summary: DatasetSummary;
};

export type AnalyzeRequest = {
  dataset_id: string;
  question: string;
};

export type ChartType = "bar" | "line" | "pie" | "area";

export type ChartConfig = {
  type: ChartType;
  title: string;
  xKey: string;
  yKey: string;
  data: DataRecord[];
};

export type AnalyzeResponse = {
  answer: string;
  chart: ChartConfig;
  insights: string[];
  table?: DataRecord[] | null;
};
