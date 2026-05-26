import { pgTable, serial, timestamp, index, foreignKey, uuid, varchar, boolean, integer, text, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

export const softwareCopyrightForms = pgTable("software_copyright_forms", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	softwareFullName: varchar("software_full_name", { length: 256 }),
	softwareShortName: varchar("software_short_name", { length: 128 }),
	version: varchar({ length: 64 }),
	softwareCategory: varchar("software_category", { length: 128 }),
	developmentDate: varchar("development_date", { length: 32 }),
	isPublished: boolean("is_published").default(false),
	developmentHardware: varchar("development_hardware", { length: 50 }),
	runtimeHardware: varchar("runtime_hardware", { length: 50 }),
	developmentOs: varchar("development_os", { length: 50 }),
	developmentTools: varchar("development_tools", { length: 50 }),
	runtimePlatform: varchar("runtime_platform", { length: 50 }),
	runtimeEnvironment: varchar("runtime_environment", { length: 50 }),
	programmingLanguage: varchar("programming_language", { length: 50 }),
	sourceCodeLines: integer("source_code_lines"),
	developmentPurpose: varchar("development_purpose", { length: 50 }),
	targetIndustry: varchar("target_industry", { length: 50 }),
	mainFunctions: text("main_functions"),
	technicalFeatures: text("technical_features"),
	companyName: varchar("company_name", { length: 256 }),
	creditCode: varchar("credit_code", { length: 32 }),
	queryCode: varchar("query_code", { length: 32 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("software_copyright_forms_created_at_idx").using("btree", table.createdAt.asc().nullsLast().op("timestamptz_ops")),
	index("software_copyright_forms_user_id_idx").using("btree", table.userId.asc().nullsLast().op("uuid_ops")),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "software_copyright_forms_user_id_users_id_fk"
		}).onDelete("cascade"),
]);

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	openid: varchar({ length: 128 }).notNull(),
	unionid: varchar({ length: 128 }),
	nickname: varchar({ length: 128 }),
	avatarUrl: varchar("avatar_url", { length: 512 }),
	phone: varchar({ length: 20 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => [
	index("users_openid_idx").using("btree", table.openid.asc().nullsLast().op("text_ops")),
	unique("users_openid_unique").on(table.openid),
]);
