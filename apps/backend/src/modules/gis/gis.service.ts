import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class GisService {
  private readonly logger = new Logger(GisService.name);
  // Default snapping threshold in degrees (0.0005 degrees is approx 55 meters)
  private readonly SNAPPING_THRESHOLD = 0.0005;

  constructor(private readonly db: DatabaseService) {}

  // --- STATIONS (Points) ---
  
  async createStation(data: {
    name: string;
    code: string;
    type: string;
    capacity_m3_h: number;
    pressure_rating_bar: number;
    coordinates: [number, number]; // [lng, lat]
    metadata?: any;
  }) {
    const { name, code, type, capacity_m3_h, pressure_rating_bar, coordinates, metadata } = data;
    
    // Spatial validation: Coordinates bounds check
    this.validateCoordinates(coordinates[0], coordinates[1]);

    const sql = `
      INSERT INTO stations (name, code, type, capacity_m3_h, pressure_rating_bar, location, metadata)
      VALUES ($1, $2, $3, $4, $5, ST_SetSRID(ST_Point($6, $7), 4326), $8)
      RETURNING id, name, code, type, status, capacity_m3_h, pressure_rating_bar, ST_AsGeoJSON(location)::json AS location, metadata
    `;

    const res = await this.db.query(sql, [
      name,
      code,
      type,
      capacity_m3_h,
      pressure_rating_bar,
      coordinates[0],
      coordinates[1],
      metadata ? JSON.stringify(metadata) : null,
    ]);

    return res.rows[0];
  }

  async getStations() {
    const sql = `
      SELECT id, name, code, type, status, capacity_m3_h, pressure_rating_bar, ST_AsGeoJSON(location)::json AS location, metadata, created_at, updated_at
      FROM stations
      ORDER BY name ASC
    `;
    const res = await this.db.query(sql);
    return res.rows;
  }

  async updateStation(id: string, data: {
    name?: string;
    type?: string;
    status?: string;
    capacity_m3_h?: number;
    pressure_rating_bar?: number;
    coordinates?: [number, number];
    metadata?: any;
  }) {
    const { name, type, status, capacity_m3_h, pressure_rating_bar, coordinates, metadata } = data;
    
    const setClauses: string[] = [];
    const params: any[] = [id];
    let counter = 2;

    if (name) { setClauses.push(`name = $${counter++}`); params.push(name); }
    if (type) { setClauses.push(`type = $${counter++}`); params.push(type); }
    if (status) { setClauses.push(`status = $${counter++}`); params.push(status); }
    if (capacity_m3_h !== undefined) { setClauses.push(`capacity_m3_h = $${counter++}`); params.push(capacity_m3_h); }
    if (pressure_rating_bar !== undefined) { setClauses.push(`pressure_rating_bar = $${counter++}`); params.push(pressure_rating_bar); }
    if (metadata) { setClauses.push(`metadata = $${counter++}`); params.push(JSON.stringify(metadata)); }
    if (coordinates) {
      this.validateCoordinates(coordinates[0], coordinates[1]);
      setClauses.push(`location = ST_SetSRID(ST_Point($${counter++}, $${counter++}), 4326)`);
      params.push(coordinates[0], coordinates[1]);
    }

    if (setClauses.length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    setClauses.push(`updated_at = CURRENT_TIMESTAMP`);
    const sql = `
      UPDATE stations
      SET ${setClauses.join(', ')}
      WHERE id = $1
      RETURNING id, name, code, type, status, capacity_m3_h, pressure_rating_bar, ST_AsGeoJSON(location)::json AS location, metadata
    `;

    const res = await this.db.query(sql, params);
    if (res.rows.length === 0) {
      throw new BadRequestException('Station not found');
    }
    return res.rows[0];
  }

  async deleteStation(id: string) {
    const res = await this.db.query('DELETE FROM stations WHERE id = $1 RETURNING id', [id]);
    if (res.rows.length === 0) {
      throw new BadRequestException('Station not found');
    }
    return { success: true, id };
  }

  // --- PIPELINES (LineStrings) ---

  async createPipeline(data: {
    name: string;
    code: string;
    type: string;
    nominal_diameter_inch: number;
    material: string;
    pressure_rating_bar: number;
    coordinates: number[][]; // [[lng, lat], [lng, lat], ...]
    source_station_id?: string;
    target_station_id?: string;
  }) {
    const { name, code, type, nominal_diameter_inch, material, pressure_rating_bar, coordinates, source_station_id, target_station_id } = data;

    if (coordinates.length < 2) {
      throw new BadRequestException('A pipeline must contain at least 2 points');
    }

    // Auto-snapping line endpoints to nearby stations if configured
    const snappedCoords = await this.snapPipelineEndpoints(coordinates);

    // Calculate length in km using geodesic calculations (ST_LengthSpheroid or ST_Length on Geography cast)
    const geoJson = {
      type: 'LineString',
      coordinates: snappedCoords,
    };

    const sql = `
      INSERT INTO pipelines (name, code, type, nominal_diameter_inch, material, pressure_rating_bar, geom, length_km, source_station_id, target_station_id)
      VALUES (
        $1, $2, $3, $4, $5, $6, 
        ST_GeomFromGeoJSON($7), 
        ST_Length(ST_Transform(ST_GeomFromGeoJSON($7), 3857)) / 1000.0, -- Project to meters to get km length
        $8, $9
      )
      RETURNING id, name, code, type, status, nominal_diameter_inch, material, pressure_rating_bar, ST_AsGeoJSON(geom)::json AS geom, length_km, source_station_id, target_station_id
    `;

    const res = await this.db.query(sql, [
      name,
      code,
      type,
      nominal_diameter_inch,
      material,
      pressure_rating_bar,
      JSON.stringify(geoJson),
      source_station_id || null,
      target_station_id || null,
    ]);

    return res.rows[0];
  }

  async getPipelines() {
    const sql = `
      SELECT id, name, code, type, status, nominal_diameter_inch, material, pressure_rating_bar, ST_AsGeoJSON(geom)::json AS geom, length_km, source_station_id, target_station_id, created_at, updated_at
      FROM pipelines
      ORDER BY name ASC
    `;
    const res = await this.db.query(sql);
    return res.rows;
  }

  async updatePipeline(id: string, data: {
    name?: string;
    type?: string;
    status?: string;
    nominal_diameter_inch?: number;
    material?: string;
    pressure_rating_bar?: number;
    coordinates?: number[][];
    source_station_id?: string;
    target_station_id?: string;
  }) {
    const { name, type, status, nominal_diameter_inch, material, pressure_rating_bar, coordinates, source_station_id, target_station_id } = data;

    const setClauses: string[] = [];
    const params: any[] = [id];
    let counter = 2;

    if (name) { setClauses.push(`name = $${counter++}`); params.push(name); }
    if (type) { setClauses.push(`type = $${counter++}`); params.push(type); }
    if (status) { setClauses.push(`status = $${counter++}`); params.push(status); }
    if (nominal_diameter_inch !== undefined) { setClauses.push(`nominal_diameter_inch = $${counter++}`); params.push(nominal_diameter_inch); }
    if (material) { setClauses.push(`material = $${counter++}`); params.push(material); }
    if (pressure_rating_bar !== undefined) { setClauses.push(`pressure_rating_bar = $${counter++}`); params.push(pressure_rating_bar); }
    if (source_station_id !== undefined) { setClauses.push(`source_station_id = $${counter++}`); params.push(source_station_id); }
    if (target_station_id !== undefined) { setClauses.push(`target_station_id = $${counter++}`); params.push(target_station_id); }

    if (coordinates) {
      if (coordinates.length < 2) {
        throw new BadRequestException('A pipeline must contain at least 2 points');
      }
      const snappedCoords = await this.snapPipelineEndpoints(coordinates);
      const geoJson = {
        type: 'LineString',
        coordinates: snappedCoords,
      };
      setClauses.push(`geom = ST_GeomFromGeoJSON($${counter++})`);
      setClauses.push(`length_km = ST_Length(ST_Transform(ST_GeomFromGeoJSON($${counter}), 3857)) / 1000.0`);
      params.push(JSON.stringify(geoJson));
      // counter is incremented once since the same parameter is reused or referenced
      counter++;
    }

    if (setClauses.length === 0) {
      throw new BadRequestException('No fields provided to update');
    }

    setClauses.push(`updated_at = CURRENT_TIMESTAMP`);
    const sql = `
      UPDATE pipelines
      SET ${setClauses.join(', ')}
      WHERE id = $1
      RETURNING id, name, code, type, status, nominal_diameter_inch, material, pressure_rating_bar, ST_AsGeoJSON(geom)::json AS geom, length_km, source_station_id, target_station_id
    `;

    const res = await this.db.query(sql, params);
    if (res.rows.length === 0) {
      throw new BadRequestException('Pipeline not found');
    }
    return res.rows[0];
  }

  async deletePipeline(id: string) {
    const res = await this.db.query('DELETE FROM pipelines WHERE id = $1 RETURNING id', [id]);
    if (res.rows.length === 0) {
      throw new BadRequestException('Pipeline not found');
    }
    return { success: true, id };
  }

  // --- SPATIAL UTILITIES & VALIDATION ---

  private validateCoordinates(lng: number, lat: number) {
    if (lng < -180 || lng > 180) {
      throw new BadRequestException(`Invalid longitude value: ${lng}. Must be between -180 and 180.`);
    }
    if (lat < -90 || lat > 90) {
      throw new BadRequestException(`Invalid latitude value: ${lat}. Must be between -90 and 90.`);
    }
  }

  private async snapPipelineEndpoints(coordinates: number[][]): Promise<number[][]> {
    const result = [...coordinates];
    const startPoint = result[0];
    const endPoint = result[result.length - 1];

    // Find closest stations to endpoints
    const startSnapped = await this.findNearestStationPoint(startPoint[0], startPoint[1]);
    const endSnapped = await this.findNearestStationPoint(endPoint[0], endPoint[1]);

    if (startSnapped) {
      this.logger.log(`Snapped pipeline start node to station: ${startSnapped.name}`);
      result[0] = startSnapped.coordinates;
    }
    if (endSnapped) {
      this.logger.log(`Snapped pipeline end node to station: ${endSnapped.name}`);
      result[result.length - 1] = endSnapped.coordinates;
    }

    return result;
  }

  private async findNearestStationPoint(lng: number, lat: number): Promise<{ name: string; coordinates: [number, number] } | null> {
    const sql = `
      SELECT name, ST_X(location) AS x, ST_Y(location) AS y, ST_Distance(location, ST_SetSRID(ST_Point($1, $2), 4326)) AS distance
      FROM stations
      WHERE ST_DWithin(location, ST_SetSRID(ST_Point($1, $2), 4326), $3)
      ORDER BY distance ASC
      LIMIT 1
    `;

    const res = await this.db.query(sql, [lng, lat, this.SNAPPING_THRESHOLD]);
    if (res.rows.length > 0) {
      const row = res.rows[0];
      return {
        name: row.name,
        coordinates: [parseFloat(row.x), parseFloat(row.y)],
      };
    }
    return null;
  }
}
