import { Service } from '../entities/service.entity';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

export function servicesToCSV(services: Service[]): string {
  const records = services.map((s) => ({
    id: s.id,
    name: s.name,
    type: s.category?.name,
    limit: s.limit,
    coverageRate: s.coverageRate,
    isActive: s.isActive,
    createdAt: s.createdAt,
  }));
  return stringify(records, { header: true });
}

export function csvToServices(csv: string): Partial<Service>[] {
  const records = parse(csv, { columns: true, skip_empty_lines: true });
  return records.map((r: any) => ({
    name: r.name,
    limit: Number(r.limit),
    coverageRate: Number(r.coverageRate),
    isActive: r.isActive === 'true' || r.isActive === true,
  }));
}
