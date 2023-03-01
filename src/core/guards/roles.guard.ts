import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "src/repository";
import { ROLES_KEY } from "src/shared/decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean {
        // What is the required roles
        const requireRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);

        if (!requireRoles) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();
        
        return requireRoles.some((role) => user?.roles.includes(role));
    }
}