import { relations } from "drizzle-orm/relations";
import { users, softwareCopyrightForms } from "./schema";

export const softwareCopyrightFormsRelations = relations(softwareCopyrightForms, ({one}) => ({
	user: one(users, {
		fields: [softwareCopyrightForms.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	softwareCopyrightForms: many(softwareCopyrightForms),
}));