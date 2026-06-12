import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request = http.getRequest();
    const method = request.method;

    // Only log write mutations (POST, PUT, PATCH, DELETE)
    if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const userId = request.user?.id || null;
    const ipAddress = request.ip || request.headers['x-forwarded-for'];
    const action = `${method} ${request.url}`;
    const newValues = method !== 'DELETE' ? request.body : null;

    // Infer target table/ID from URL parameters (e.g. /api/v1/stations/some-uuid)
    const urlParts = request.url.split('/');
    const targetTable = urlParts[2] || 'unknown';
    const targetId = urlParts[3] || '00000000-0000-0000-0000-000000000000';

    return next.handle().pipe(
      tap((response) => {
        // If operation succeeded, execute the audit logging asynchronously
        const resolvedId = response?.id || targetId;
        this.auditService.log({
          userId,
          action,
          targetTable,
          targetId: resolvedId,
          newValues,
          ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
        });
      }),
    );
  }
}
