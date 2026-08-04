const { User } = require("../models");

async function createAdmin() {
  try {
    const adminEmail = (
      process.env.ADMIN_EMAIL || "bunny@gmail.com"
    ).toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "Bunny@123";

    let admin = await User.findOne({
      where: {
        email: adminEmail,
      },
    });

    if (!admin) {
      admin = await User.findOne({
        where: {
          role: "admin",
        },
      });
    }

    if (admin) {
      await admin.update({
        name: admin.name || "Dada",
        email: adminEmail,
        role: "admin",
        password: adminPassword,
      });
      console.log("Admin already exists; password refreshed");
      return;
    }

    await User.create({
      name: "Dada",
      email: adminEmail,
      password: adminPassword,
      role: "admin",
    });

    console.log("Admin created successfully");
  } catch (error) {
    console.error("Error creating admin:", error);
  }
}

module.exports = createAdmin;
