import './loadenv';

/**
 * The config properties here are defined in the  dotenv `.env.*` files.
 * They are loaded based on the build environment.
 */
export const Config = {
	PORT: process.env.PORT || '',
	BASE_URL: process.env.BASE_URL || '',
	DB_URL: process.env.DB_URL || '',
	COOKIE_SECRET: process.env.COOKIE_SECRET || '',
	JWT_SECRET: process.env.JWT_SECRET || '',
	FORGOT_PASSWORD_URL: process.env.FORGOT_PASSWORD_URL || '',
} as const;
