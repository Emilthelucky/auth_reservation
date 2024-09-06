export type APIError = {
    statusCode: number
    message: string
}

export type ServerErrors = {
    INERTIAL_SERVER_ERROR: APIError
    DATABASE_ERROR: APIError
    NOT_FOUND_ERROR: APIError
}

export type AuthenticationErrors = {
    INVALID_ROLE_ERROR: APIError
    USER_NOT_FOUND_ERROR: APIError
    ALREADY_VERIFIED_ERROR: APIError
    CODE_EXPIRED_ERROR: APIError
    INCORRECT_CODE_ERROR: APIError
    NOT_AUTHENTICATED_ERROR: APIError
    INCORRECT_PASSWORD_ERROR: APIError
    INVALID_EMAIL_ERROR: APIError
    MISSING_EMAIL_ERROR: APIError
    MISSING_USERNAME_ERROR: APIError
    MISSING_PASSWORD_ERROR: APIError
    NOT_STRONG_PASSWORD_ERROR: APIError
    USERNAME_FOUND_ERROR: APIError
    EMAIL_FOUND_ERROR: APIError
    MISSING_FIELDS_ERROR: APIError
}

export type AuthorizationErrors = {
    MISSING_AUTHORIZATION_ERROR: APIError
    INVALID_AUTHORIZATION_ERROR: APIError
    FORBIDDEN_ERROR: APIError
    EXPIRED_AUTHORIZATION_ERROR: APIError
    NOT_AUTHORIZED_ERROR: APIError
}

export type VenueErrors = {
    MISSING_ID_ERROR: APIError
    VENUE_NOT_FOUND_ERROR: APIError
    MISSING_FIELDS_ERROR: APIError
    INTERNAL_SERVER_ERROR: APIError
}

export type ReservationErrors = {
    MISSING_FIELDS_ERROR: APIError
    VENUE_NOT_FOUND_ERROR: APIError
    INVALID_DATE_ERROR: APIError
    TIME_SLOT_OCCUPIED_ERROR: APIError
    INTERNAL_SERVER_ERROR: APIError
    NO_RESERVATION_FOUND: APIError
    RESERVATION_NOT_FOUND: APIError
    MISSING_RESERVATION_ID: APIError
}

export type SystemErrors = {
    server: ServerErrors
    authentication: AuthenticationErrors
    authorization: AuthorizationErrors
    venue: VenueErrors
    reservation: ReservationErrors
}

export type APIErrors = {
    system: SystemErrors
}
