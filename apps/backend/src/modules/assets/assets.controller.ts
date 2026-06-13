import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AssetsService, CreateAssetDto, UpdateAssetDto, AssetQueryDto } from './assets.service';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  /**
   * GET /api/v1/assets/stats
   * Returns aggregate counts by type and status
   */
  @Get('stats')
  getStats() {
    return this.assetsService.getAssetStats();
  }

  /**
   * GET /api/v1/assets?type=METER&status=ACTIVE&search=valve&page=1&limit=20
   * Paginated, filterable list of all assets
   */
  @Get()
  findAll(@Query() query: AssetQueryDto) {
    return this.assetsService.findAll(query);
  }

  /**
   * GET /api/v1/assets/:id
   * Get a single asset including parent station/pipeline info
   */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.assetsService.findOne(id);
  }

  /**
   * POST /api/v1/assets
   * Create a new asset (must link to station OR pipeline)
   */
  @Post()
  create(@Body() createAssetDto: CreateAssetDto) {
    return this.assetsService.createAsset(createAssetDto);
  }

  /**
   * PATCH /api/v1/assets/:id
   * Update asset fields (partial update)
   */
  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateAssetDto: UpdateAssetDto) {
    return this.assetsService.updateAsset(id, updateAssetDto);
  }

  /**
   * DELETE /api/v1/assets/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.assetsService.deleteAsset(id);
  }
}
