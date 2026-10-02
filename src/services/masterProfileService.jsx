import masterProfile from "../data/masterProfile";

export async function getMasterProfile() {
  return { ...masterProfile };
}

export async function updateMasterProfile(patch) {
  Object.assign(masterProfile, patch);

  return { ...masterProfile };
}
