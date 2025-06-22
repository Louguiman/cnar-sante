import { Structure } from '../entities/structure.entity';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

export function structuresToCSV(structures: Structure[]): string {
  const records = structures.map((s) => ({
    id: s.id,
    name: s.name,
    type: s.type,
    city: s.city,
    address: s.address,
    isActive: s.isActive,
    createdAt: s.createdAt,
  }));
  return stringify(records, { header: true });
}

export function csvToStructures(csv: string): Partial<Structure>[] {
  const records = parse(csv, { columns: true, skip_empty_lines: true });
  return records.map((r: any) => ({
    name: r.name,
    type: r.type,
    city: r.city,
    address: r.address,
    isActive: r.isActive === 'true' || r.isActive === true,
  }));
}
