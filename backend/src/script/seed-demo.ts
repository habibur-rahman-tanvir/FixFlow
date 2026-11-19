import mongoose from "mongoose";
import { envERROR } from "../utils/checkENV.js";
import { UserModel } from "../model/user.model.js";
import { OrganizationModel } from "../model/organization.model.js";

// ==================================================
// CONFIGURATION
// ==================================================

const ADMIN_USERS = 3;
const MANAGER_USERS = 80;
const TECHNICIAN_USERS = 200;
const MEMBER_USERS = 500;
const VISITOR_USERS = 75;

const TOTAL_ORGANIZATIONS: number = 100;

const DEFAULT_PASSWORD = "12345678";

// Role-specific passwords (optional)
const ROLE_PASSWORDS: Partial<Record<SeedRole, string>> = {
  // admin: "admin123456",
  // manager: "manager123456",
  // technician: "technician123456",
  // member: "member123456",
  // visitor: "visitor123456",
};

// Name prefixes
const ADMIN_PREFIX = "Admin ";
const MANAGER_PREFIX = "Manager ";
const TECHNICIAN_PREFIX = "Technician ";
const MEMBER_PREFIX = "Member ";
const VISITOR_PREFIX = "Visitor ";

const ORG_PREFIX = "Organization ";

// ==================================================
// TYPES
// ==================================================

type SeedRole = "admin" | "manager" | "technician" | "member" | "visitor";

type RoleConfig = {
  role: SeedRole;
  count: number;
  prefix: string;
  password: string;
};

// ==================================================
// CONSTANTS
// ==================================================

const resetExistingData = process.argv.includes("--reset");

const timezones = [
  "UTC",
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Berlin",
  "Africa/Cairo",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Asia/Singapore",
  "Asia/Tokyo",
  "Australia/Sydney",
];

const roleConfigs: RoleConfig[] = [
  {
    role: "admin",
    count: ADMIN_USERS,
    prefix: ADMIN_PREFIX,
    password: ROLE_PASSWORDS.admin || DEFAULT_PASSWORD,
  },
  {
    role: "manager",
    count: MANAGER_USERS,
    prefix: MANAGER_PREFIX,
    password: ROLE_PASSWORDS.manager || DEFAULT_PASSWORD,
  },
  {
    role: "technician",
    count: TECHNICIAN_USERS,
    prefix: TECHNICIAN_PREFIX,
    password: ROLE_PASSWORDS.technician || DEFAULT_PASSWORD,
  },
  {
    role: "member",
    count: MEMBER_USERS,
    prefix: MEMBER_PREFIX,
    password: ROLE_PASSWORDS.member || DEFAULT_PASSWORD,
  },
  {
    role: "visitor",
    count: VISITOR_USERS,
    prefix: VISITOR_PREFIX,
    password: ROLE_PASSWORDS.visitor || DEFAULT_PASSWORD,
  },
];

// ==================================================
// VALIDATION
// ==================================================

const validateConfiguration = () => {
  for (const config of roleConfigs) {
    if (!Number.isInteger(config.count) || config.count < 0) {
      throw new Error(`Invalid user count for role "${config.role}".`);
    }

    if (!config.password) {
      throw new Error(`Password is required for role "${config.role}".`);
    }
  }

  if (!Number.isInteger(TOTAL_ORGANIZATIONS) || TOTAL_ORGANIZATIONS < 0) {
    throw new Error("Invalid TOTAL_ORGANIZATIONS value.");
  }

  if (MANAGER_USERS > TOTAL_ORGANIZATIONS) {
    throw new Error("MANAGER_USERS cannot exceed TOTAL_ORGANIZATIONS.");
  }

  if (TOTAL_ORGANIZATIONS > 0) {
    const requiredRoles: SeedRole[] = ["admin", "manager", "technician"];

    for (const role of requiredRoles) {
      const config = roleConfigs.find((item) => item.role === role);

      if (!config || config.count === 0) {
        throw new Error(
          `At least one ${role} user is required when organizations are created.`,
        );
      }
    }
  }

  if (MEMBER_USERS > 0 && TOTAL_ORGANIZATIONS === 0) {
    throw new Error(
      "At least one organization is required when members are created.",
    );
  }
};

// ==================================================
// USER SEED DOCUMENTS
// ==================================================

const userSeedDocs = roleConfigs.flatMap(({ role, count, prefix, password }) =>
  Array.from({ length: count }, (_, index) => ({
    name: `${prefix}${index + 1}`,
    email: `${role}${index + 1}@gmail.com`,
    password,
    verifiedBy: "email" as const,
    userStatus: "active" as const,
    role,
  })),
);

// ==================================================
// ORGANIZATION SEED DOCUMENTS
// ==================================================

const orgSeedDocs = Array.from({ length: TOTAL_ORGANIZATIONS }, (_, index) => {
  const orgNumber = index + 1;

  return {
    name: `${ORG_PREFIX}${orgNumber}`,
    slug: `organization-${orgNumber}`,
    description: `Seeded organization ${orgNumber} for demo data and QA testing.`,
    timezone: timezones[index % timezones.length],
  };
});

// ==================================================
// MAIN
// ==================================================

const main = async () => {
  validateConfiguration();

  const { MONGODB_URI } = envERROR({
    MONGODB_URI: process.env.MONGODB_URI,
  });

  await mongoose.connect(MONGODB_URI);

  try {
    // ----------------------------------------------
    // RESET EXISTING DATA
    // ----------------------------------------------

    if (resetExistingData) {
      await Promise.all([
        UserModel.deleteMany({}),
        OrganizationModel.deleteMany({}),
      ]);
    }

    // ----------------------------------------------
    // CREATE USERS
    // ----------------------------------------------

    const createdUsers = await UserModel.create(userSeedDocs);

    const usersByRole = {
      admin: createdUsers.filter((user) => user.role === "admin"),
      manager: createdUsers.filter((user) => user.role === "manager"),
      technician: createdUsers.filter((user) => user.role === "technician"),
      member: createdUsers.filter((user) => user.role === "member"),
      visitor: createdUsers.filter((user) => user.role === "visitor"),
    };

    const {
      admin: adminUsers,
      manager: managerUsers,
      technician: technicianUsers,
      member: memberUsers,
    } = usersByRole;

    // ----------------------------------------------
    // CREATE ORGANIZATIONS
    // ----------------------------------------------

    const organizationRecords = orgSeedDocs.map((org, index) => {
      const admin = adminUsers[index % adminUsers.length]!;
      const manager = managerUsers[index % managerUsers.length]!;

      return {
        ...org,
        createdBy: admin._id,
        manager: manager._id,
      };
    });

    const createdOrganizations =
      await OrganizationModel.insertMany(organizationRecords);

    // ----------------------------------------------
    // ASSIGN ORGANIZATIONS TO USERS
    // ----------------------------------------------

    const bulkOps: mongoose.AnyBulkWriteOperation[] = [];

    createdOrganizations.forEach((org, index) => {
      const manager = managerUsers[index % managerUsers.length]!;

      // Assign organization to manager
      bulkOps.push({
        updateOne: {
          filter: { _id: manager._id },
          update: {
            $addToSet: {
              managerOf: org._id,
            },
          },
        },
      });

      // Assign two technicians to each organization
      for (let offset = 0; offset < 2; offset += 1) {
        const technician =
          technicianUsers[(index * 2 + offset) % technicianUsers.length]!;

        bulkOps.push({
          updateOne: {
            filter: { _id: technician._id },
            update: {
              $addToSet: {
                technicianOf: org._id,
              },
            },
          },
        });
      }
    });

    // ----------------------------------------------
    // ASSIGN EVERY MEMBER TO AN ORGANIZATION
    // ----------------------------------------------

    memberUsers.forEach((member, index) => {
      const organization =
        createdOrganizations[index % createdOrganizations.length]!;

      bulkOps.push({
        updateOne: {
          filter: { _id: member._id },
          update: {
            $set: {
              memberOf: organization._id,
            },
          },
        },
      });
    });

    // ----------------------------------------------
    // EXECUTE BULK OPERATIONS
    // ----------------------------------------------

    if (bulkOps.length > 0) {
      await UserModel.bulkWrite(bulkOps, {
        ordered: true,
      });
    }

    // ----------------------------------------------
    // SUMMARY
    // ----------------------------------------------

    console.log("\n========== SEED SUMMARY ==========\n");

    console.log(`Total Users: ${createdUsers.length}`);
    console.log(`Total Organizations: ${createdOrganizations.length}`);

    console.log("\nUsers by Role:");

    for (const config of roleConfigs) {
      console.log(`${config.role}: ${config.count}`);
    }

    console.log("\nOrganization Assignments:");
    console.log(`Managers: ${managerUsers.length}`);
    console.log(`Technicians: ${technicianUsers.length}`);
    console.log(`Members: ${memberUsers.length}`);
    console.log(`Visitors: ${usersByRole.visitor.length}`);

    console.log("\nDefault Password:", DEFAULT_PASSWORD);
    console.log("\nSeed completed successfully!");
  } finally {
    await mongoose.disconnect();
  }
};

// ==================================================
// EXECUTION
// ==================================================

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exitCode = 1;
});
