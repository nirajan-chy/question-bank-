const { User } = require("../models");

async function createAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.warn("⚠️  ADMIN_EMAIL and ADMIN_PASSWORD not set — skipping admin bootstrap");
    return;
  }

  try {
    let admin = await User.findOne({ where: { email: adminEmail } });

    if (!admin) {
      admin = await User.findOne({ where: { role: "admin" } });
    }

    if (admin) {
      // Promote to admin but never overwrite an existing password.
      const updates = {};
      if (admin.role !== "admin") updates.role = "admin";
      if (admin.email !== adminEmail) updates.email = adminEmail;
      if (Object.keys(updates).length > 0) {
        await admin.update(updates);
        console.log("✅ Admin account promoted/updated (password unchanged)");
      } else {
        console.log("ℹ️  Admin already exists — skipping");
      }
      return;
    }

    await User.create({
      name: "Admin",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });
    console.log("✅ Admin created successfully");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  }
}

module.exports = createAdmin;
