import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

export type AssetType = 'METER' | 'VALVE' | 'REGULATOR' | 'TRANSMITTER' | 'SCRUBBER' | 'FILTER';

export interface CreateAssetDto {
  name: string;
  asset_tag: string;
  type: AssetType;
  manufacturer?: string;
  model?: string;
  serial_number?: string;
  installation_date?: string;
  last_inspection_date?: string;
  next_inspection_date?: string;
  status?: string;
  station_id?: string;
  pipeline_id?: string;
  metadata?: Record<string, any>;
}

export interface UpdateAssetDto extends Partial<CreateAssetDto> {}

export interface AssetQueryDto {
  type?: AssetType;
  status?: string;
  station_id?: string;
  pipeline_id?: string;
  search?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class AssetsService {
  private readonly logger = new Logger(AssetsService.name);

  constructor(private readonly db: DatabaseService) {}

  async createAsset(data: CreateAssetDto) {
    this.logger.log(`Creating asset: ${data.name} (${data.type})`);

    if (!data.station_id && !data.pipeline_id) {
      throw new BadRequestException('Asset must be linked to either a station or a pipeline');
    }

    const sql = `
      INSERT INTO assets (
        name, asset_tag, type, manufacturer, model, serial_number,
        installation_date, last_inspection_date, next_inspection_date,
        status, station_id, pipeline_id, metadata
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const res = await this.db.query(sql, [
      data.name,
      data.asset_tag,
      data.type,
      data.manufacturer || null,
      data.model || null,
      data.serial_number || null,
      data.installation_date || null,
      data.last_inspection_date || null,
      data.next_inspection_date || null,
      data.status || 'ACTIVE',
      data.station_id || null,
      data.pipeline_id || null,
      data.metadata ? JSON.stringify(data.metadata) : null,
    ]);

    return res.rows[0];
  }

  async findAll(query: AssetQueryDto = {}) {
    const { type, status, station_id, pipeline_id, search, page = 1, limit = 50 } = query;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIdx = 1;

    if (type) {
      conditions.push(`a.type = $${paramIdx++}`);
      params.push(type);
    }
    if (status) {
      conditions.push(`a.status = $${paramIdx++}`);
      params.push(status);
    }
    if (station_id) {
      conditions.push(`a.station_id = $${paramIdx++}`);
      params.push(station_id);
    }
    if (pipeline_id) {
      conditions.push(`a.pipeline_id = $${paramIdx++}`);
      params.push(pipeline_id);
    }
    if (search) {
      conditions.push(
        `(a.name ILIKE $${paramIdx} OR a.asset_tag ILIKE $${paramIdx} OR a.manufacturer ILIKE $${paramIdx} OR a.serial_number ILIKE $${paramIdx})`
      );
      params.push(`%${search}%`);
      paramIdx++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const offset = (page - 1) * limit;

    const countRes = await this.db.query(`SELECT COUNT(*) FROM assets a ${whereClause}`, params);
    const total = parseInt(countRes.rows[0].count, 10);

    const sql = `
      SELECT
        a.*,
        s.name AS station_name,
        s.code AS station_code,
        p.name AS pipeline_name,
        p.code AS pipeline_code
      FROM assets a
      LEFT JOIN stations s ON a.station_id = s.id
      LEFT JOIN pipelines p ON a.pipeline_id = p.id
      ${whereClause}
      ORDER BY a.created_at DESC
      LIMIT $${paramIdx++} OFFSET $${paramIdx}
    `;
    params.push(limit, offset);

    const res = await this.db.query(sql, params);

    return {
      data: res.rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const sql = `
      SELECT
        a.*,
        s.name AS station_name,
        s.code AS station_code,
        ST_AsGeoJSON(s.location)::json AS station_location,
        p.name AS pipeline_name,
        p.code AS pipeline_code
      FROM assets a
      LEFT JOIN stations s ON a.station_id = s.id
      LEFT JOIN pipelines p ON a.pipeline_id = p.id
      WHERE a.id = $1
    `;
    const res = await this.db.query(sql, [id]);
    if (res.rows.length === 0) {
      throw new NotFoundException(`Asset with id ${id} not found`);
    }
    return res.rows[0];
  }

  async updateAsset(id: string, data: UpdateAssetDto) {
    const setClauses: string[] = [];
    const params: any[] = [id];
    let counter = 2;

    const fields: Array<[string, any]> = [
      ['name', data.name],
      ['asset_tag', data.asset_tag],
      ['type', data.type],
      ['manufacturer', data.manufacturer],
      ['model', data.model],
      ['serial_number', data.serial_number],
      ['installation_date', data.installation_date],
      ['last_inspection_date', data.last_inspection_date],
      ['next_inspection_date', data.next_inspection_date],
      ['status', data.status],
      ['station_id', data.station_id],
      ['pipeline_id', data.pipeline_id],
    ];

    for (const [field, val] of fields) {
      if (val !== undefined) {
        setClauses.push(`${field} = $${counter++}`);
        params.push(val);
      }
    }

    if (data.metadata !== undefined) {
      setClauses.push(`metadata = $${counter++}`);
      params.push(JSON.stringify(data.metadata));
    }

    if (setClauses.length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    setClauses.push('updated_at = CURRENT_TIMESTAMP');

    const sql = `
      UPDATE assets SET ${setClauses.join(', ')}
      WHERE id = $1
      RETURNING *
    `;

    const res = await this.db.query(sql, params);
    if (res.rows.length === 0) {
      throw new NotFoundException(`Asset with id ${id} not found`);
    }
    return res.rows[0];
  }

  async deleteAsset(id: string) {
    const res = await this.db.query('DELETE FROM assets WHERE id = $1 RETURNING id', [id]);
    if (res.rows.length === 0) {
      throw new NotFoundException(`Asset with id ${id} not found`);
    }
    return { success: true, id };
  }

  async getAssetStats() {
    const sql = `
      SELECT
        type,
        status,
        COUNT(*) AS count
      FROM assets
      GROUP BY type, status
      ORDER BY type, status
    `;
    const res = await this.db.query(sql);

    // Pivot by type
    const summary: Record<string, any> = {};
    for (const row of res.rows) {
      if (!summary[row.type]) {
        summary[row.type] = { total: 0, statuses: {} };
      }
      summary[row.type].total += parseInt(row.count, 10);
      summary[row.type].statuses[row.status] = parseInt(row.count, 10);
    }

    const totalRes = await this.db.query('SELECT COUNT(*) FROM assets');
    return {
      total: parseInt(totalRes.rows[0].count, 10),
      byType: summary,
    };
  }
}
