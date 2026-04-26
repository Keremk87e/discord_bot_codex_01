export class AppError extends Error { constructor(message: string, public readonly code: string) { super(message); }}
export class ValidationError extends AppError { constructor(message: string) { super(message, 'ValidationError'); }}
export class PermissionError extends AppError { constructor(message: string) { super(message, 'PermissionError'); }}
export class CooldownError extends AppError { constructor(message: string) { super(message, 'CooldownError'); }}
export class ModuleDisabledError extends AppError { constructor(message: string) { super(message, 'ModuleDisabledError'); }}
export class DiscordApiError extends AppError { constructor(message: string) { super(message, 'DiscordApiError'); }}
export class DatabaseError extends AppError { constructor(message: string) { super(message, 'DatabaseError'); }}
export class UnknownError extends AppError { constructor(message: string) { super(message, 'UnknownError'); }}
