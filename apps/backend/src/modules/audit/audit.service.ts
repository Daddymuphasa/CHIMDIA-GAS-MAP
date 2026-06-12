import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly db: DatabaseService) {}

  async log(params: {
    userId: string | null;
    action: string;
    targetTable: string;
    targetId: string;
    oldValues?: any;
    newValues?: any;
    ipAddress?: string;
  }) {
    const { userId, action, targetTable, targetId, oldValues, newValues, ipAddress } = params;

    const sql = `
      INSERT INTO audit_logs (user_id, action, target_table, target_id, old_values, new_values, ip_address)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;

    try {
      // Resolve PostgreSQL user UUID based on Keycloak external ID
      let resolvedUserId: string | null = null;
      if (userId) {
        const userRes = await this.db.query('SELECT id FROM users WHERE keycloak_id = $1', [userId]);
        if (userRes.rows.length > 0) {
          resolvedUserId = userRes.rows[0].id;
        }
      }

      await this.db.query(sql, [
        resolvedUserId,
        action,
        targetTable,
        targetId,
        oldValues ? JSON.stringify(oldValues) : null,
        newValues ? JSON.stringify(newValues) : null,
        ipAddress || null,
      ]);
    } catch (error) {
      this.logger.error('Failed to write audit log entry', error);
    }
  }
}
