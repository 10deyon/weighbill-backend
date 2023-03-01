import { Role } from "src/repository"

export const USER_TYPE = {
    ADMIN: Role.ADMIN,
    CUSTOMER: Role.CUSTOMER,
    AGENT: Role.AGENT,
    DISPATCHER: Role.DISPATCHER,
    LOCATION_MANAGER: Role.LOCATION_MANAGER
}

export const PAYMENT_MODE = {
    OFFLINE: 'offline',
    TRANSFER: 'transfer',
    CARD: 'card',
}

export const PAYMENT_STATUS = {
    PENDING: 'pending',
    SUCCESS: 'successful',
    FAILED: 'failed',
}

export const TRANSACTION_STATUS = {
    SUCCESSFUL: 'successful',
    PENDING: 'initiated',
    FAILED: 'failed',
}
