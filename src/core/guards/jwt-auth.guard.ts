import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') { }

@Injectable()
export class JwtAdminTechnicianAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        // Add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        const authorizedList = ['ADMIN', 'TECHNICIAN'];
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user || !user.userTypeId) {
            throw err || new UnauthorizedException();
        }

        if (!authorizedList.includes(user.userType)) {
            throw new UnauthorizedException();
        }
        return user;
    }
}

@Injectable()
export class JwtAdminAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        // Add your custom authentication logic here
        // for example, call super.logIn(request) to establish a session.
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        const authorizedList = ['ADMIN'];
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException();
        }

        if (!authorizedList.includes(user.userType)) {
            throw new UnauthorizedException();
        }
        return user;
    }
}
