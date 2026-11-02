import mongoose from "mongoose";
import { envERROR } from "../utils/checkENV.js";
import { UserModel } from "../model/user.model.js";
import { OrganizationModel } from "../model/organization.model.js";

const TOTAL_USERS = 150;
const TOTAL_ORGANIZATIONS = 80;
const DEFAULT_PASSWORD = "12345678";

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

const resetExistingData = process.argv.includes("--reset");

const roleOrder = [
  ...Array.from({ length: 5 }, () => "admin" as const),
  ...Array.from({ length: 35 }, () => "manager" as const),
  ...Array.from({ length: 40 }, () => "technician" as const),
  ...Array.from({ length: TOTAL_USERS - 80 }, () => "member" as const),
];

const userSeedDocs = roleOrder.map((role, index) => {
  const suffix = index + 1;
  const name =
    role === "admin"
      ? `Admin ${suffix}`
      : role === "manager"
        ? `Manager ${suffix}`
        : role === "technician"
          ? `Technician ${suffix}`
          : `Member ${suffix}`;

  return {
    name,
    email: `${role}${suffix}@example.com`,
    password: DEFAULT_PASSWORD,
    verifiedBy: "email" as const,
    userStatus: "active" as const,
    role,
  };
});

const orgSeedDocs = Array.from({ length: TOTAL_ORGANIZATIONS }, (_, index) => {
  const orgNumber = index + 1;
  return {
    name: `Organization ${orgNumber}`,
    slug: `organization-${orgNumber}`,
    description: `Seeded organization ${orgNumber} for demo data and QA testing.`,
    timezone: timezones[index % timezones.length],
  };
});

const main = async () => {
  const { MONGODB_URI } = envERROR({ MONGODB_URI: process.env.MONGODB_URI });

  await mongoose.connect(MONGODB_URI);

  if (resetExistingData) {
    await Promise.all([
      UserModel.deleteMany({}),
      OrganizationModel.deleteMany({}),
    ]);
  }

  // const createdUsers = await UserModel.insertMany(userSeedDocs);
  const createdUsers = await UserModel.create(userSeedDocs);

  const adminUsers = createdUsers.filter((user) => user.role === "admin");
  const managerUsers = createdUsers.filter((user) => user.role === "manager");
  const technicianUsers = createdUsers.filter(
    (user) => user.role === "technician",
  );
  const memberUsers = createdUsers.filter((user) => user.role === "member");

  if (
    adminUsers.length === 0 ||
    managerUsers.length === 0 ||
    technicianUsers.length === 0 ||
    memberUsers.length === 0
  ) {
    throw new Error("Seed data is missing required role groups.");
  }

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

  const bulkOps: any[] = [];

  createdOrganizations.forEach((org, index) => {
    const manager = managerUsers[index % managerUsers.length]!;
    const managerId = manager._id;

    bulkOps.push({
      updateOne: {
        filter: { _id: managerId },
        update: { $addToSet: { managerOf: org._id } },
      },
    });

    for (let techOffset = 0; techOffset < 2; techOffset += 1) {
      const technician =
        technicianUsers[(index * 2 + techOffset) % technicianUsers.length]!;

      bulkOps.push({
        updateOne: {
          filter: { _id: technician._id },
          update: { $addToSet: { technicianOf: org._id } },
        },
      });
    }

    const member = memberUsers[(index * 2) % memberUsers.length]!;
    bulkOps.push({
      updateOne: {
        filter: { _id: member._id },
        update: { $set: { memberOf: org._id } },
      },
    });
  });

  if (bulkOps.length > 0) {
    await UserModel.bulkWrite(bulkOps, { ordered: true });
  }

  console.log(
    `Seed complete: ${createdUsers.length} users and ${createdOrganizations.length} organizations created.`,
  );
  console.log(`Default password for all seeded users: ${DEFAULT_PASSWORD}`);
};

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
