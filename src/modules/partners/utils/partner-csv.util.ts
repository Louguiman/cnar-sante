import { Partner } from '../entities/partner.entity';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';

// Convert Partner entities to CSV string
export function partnersToCSV(partners: Partner[]): string {
  const records = partners.map((p) => ({
    id: p.id,
    name: p.name,
    type: p.type,
    city: p.city,
    address: p.address,
    isActive: p.status === 'active',
    createdAt: p.createdAt ? p.createdAt.toISOString() : '',
  }));
  return stringify(records, { header: true });
}

// Parse CSV string to array of Partial<Partner>
export function csvToPartners(csv: string): Partial<Partner>[] {
  const records = parse(csv, { columns: true, skip_empty_lines: true });
  return records.map((r: any) => ({
    id: r.id ? r.id : undefined,
    name: r.name,
    type: r.type,
    city: r.city,
    address: r.address,
    status:
      r.isActive === 'true' || r.isActive === true ? 'active' : 'inactive',
    createdAt: r.createdAt ? new Date(r.createdAt) : undefined,
  }));
}
