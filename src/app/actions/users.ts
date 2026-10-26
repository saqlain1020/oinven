"use server";

import { revalidatePath } from "next/cache";
import { auth } from "auth";
import User, { UserRole } from "../../../lib/models/User";
import { hashPassword } from "../../../lib/password";

async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role !== UserRole.Admin) throw new Error("Only the admin can manage users");
}

export async function isAdmin() {
  const session = await auth();
  return session?.user?.role === UserRole.Admin;
}

// Used by the root layout so deleted users lose access even with a valid session cookie
export async function userExists(id: string) {
  return !!(await User.exists({ _id: id }).catch(() => null));
}

export async function getUsers() {
  await requireAdmin();
  const items = await User.find().select("username role").sort({ role: 1, username: 1 }).lean();
  return items.map((u) => ({ _id: u._id.toString(), username: u.username, role: u.role }));
}

export async function addUser(formData: FormData) {
  await requireAdmin();
  const username = String(formData.get("username") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  if (!username || !password) return;
  if (await User.exists({ username })) return;
  await User.create({ username, passwordHash: await hashPassword(password), role: UserRole.User });
  revalidatePath("/manage_users");
}

export async function setUserPassword(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const password = String(formData.get("password") || "");
  if (!password) return;
  await User.updateOne({ _id: id }, { passwordHash: await hashPassword(password) });
  revalidatePath("/manage_users");
}

export async function deleteUser(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await User.deleteOne({ _id: id, role: { $ne: UserRole.Admin } });
  revalidatePath("/manage_users");
}
