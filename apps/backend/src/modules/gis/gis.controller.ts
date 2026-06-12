import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { GisService } from './gis.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AuditInterceptor } from '../audit/audit.interceptor';

@Controller('gis')
export class GisController {
  constructor(private readonly gisService: GisService) {}

  // --- STATIONS ROUTES ---

  @Get('stations')
  async getStations() {
    return this.gisService.getStations();
  }

  @Post('stations')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  @UseInterceptors(AuditInterceptor)
  async createStation(
    @Body() data: {
      name: string;
      code: string;
      type: string;
      capacity_m3_h: number;
      pressure_rating_bar: number;
      coordinates: [number, number];
      metadata?: any;
    },
  ) {
    return this.gisService.createStation(data);
  }

  @Put('stations/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  @UseInterceptors(AuditInterceptor)
  async updateStation(
    @Param('id') id: string,
    @Body() data: {
      name?: string;
      type?: string;
      status?: string;
      capacity_m3_h?: number;
      pressure_rating_bar?: number;
      coordinates?: [number, number];
      metadata?: any;
    },
  ) {
    return this.gisService.updateStation(id, data);
  }

  @Delete('stations/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  @UseInterceptors(AuditInterceptor)
  async deleteStation(@Param('id') id: string) {
    return this.gisService.deleteStation(id);
  }

  // --- PIPELINES ROUTES ---

  @Get('pipelines')
  async getPipelines() {
    return this.gisService.getPipelines();
  }

  @Post('pipelines')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  @UseInterceptors(AuditInterceptor)
  async createPipeline(
    @Body() data: {
      name: string;
      code: string;
      type: string;
      nominal_diameter_inch: number;
      material: string;
      pressure_rating_bar: number;
      coordinates: number[][];
      source_station_id?: string;
      target_station_id?: string;
    },
  ) {
    return this.gisService.createPipeline(data);
  }

  @Put('pipelines/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  @UseInterceptors(AuditInterceptor)
  async updatePipeline(
    @Param('id') id: string,
    @Body() data: {
      name?: string;
      type?: string;
      status?: string;
      nominal_diameter_inch?: number;
      material?: string;
      pressure_rating_bar?: number;
      coordinates?: number[][];
      source_station_id?: string;
      target_station_id?: string;
    },
  ) {
    return this.gisService.updatePipeline(id, data);
  }

  @Delete('pipelines/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'operator')
  @UseInterceptors(AuditInterceptor)
  async deletePipeline(@Param('id') id: string) {
    return this.gisService.deletePipeline(id);
  }
}
