// Job Board Tables
export const jobListings = mysqlTable("job_listings", {
  id: int("id").autoincrement().primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(), // "Remote - Worldwide", "Remote - Europe", etc.
  salaryMin: int("salary_min"), // in USD
  salaryMax: int("salary_max"),
  jobType: varchar("job_type", { length: 50 }).notNull(), // "Full-time", "Contract", "Part-time"
  skills: text("skills").notNull(), // JSON array: ["Cypress", "Playwright", "Selenium"]
  description: text("description").notNull(),
  requirements: text("requirements"), // JSON array
  companySize: varchar("company_size", { length: 50 }), // "Startup", "Mid-size", "Enterprise"
  applyUrl: text("apply_url").notNull(),
  postedDate: timestamp("posted_date").notNull(),
  source: varchar("source", { length: 100 }).notNull(), // "LinkedIn", "Indeed", "Remote.co", etc.
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const jobApplications = mysqlTable("job_applications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(),
  jobId: int("job_id").notNull(),
  status: varchar("status", { length: 50 }).notNull().default("saved"), // "saved", "applied", "interview", "offer", "rejected"
  notes: text("notes"),
  appliedDate: timestamp("applied_date"),
  interviewDate: timestamp("interview_date"),
  followUpDate: timestamp("follow_up_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
