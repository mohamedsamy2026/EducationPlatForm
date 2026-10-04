// فحص ملفات المفاتيح محليًا. بيطبع أسماء المتغيرات ونتيجة الفحص فقط، ولا يطبع أي قيمة كاملة.
// التشغيل (من جذر المشروع):  node check-env.mjs
import { existsSync, readFileSync } from "node:fs";

const mask = (v) => (v ? `${v.slice(0, 4)}… (${v.length} حرف)` : "فاضي");
let errors = 0;
let warnings = 0;
const err = (m) => { errors += 1; console.log(`  ✗ ${m}`); };
const warn = (m) => { warnings += 1; console.log(`  ! ${m}`); };
const ok = (m) => console.log(`  ✓ ${m}`);

function load(file) {
  if (!existsSync(file)) return null;
  const vars = {};
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) vars[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return vars;
}

function jwtRole(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    return JSON.parse(Buffer.from(parts[1], "base64url").toString("utf8")).role ?? null;
  } catch {
    return null;
  }
}

function need(vars, name, file) {
  if (!vars[name]) { err(`${name} ناقص في ${file}`); return false; }
  return true;
}

// ---------- .env.local (يظهر في المتصفح) ----------
console.log("\n[.env.local] متغيرات المتصفح (عامة)");
const local = load(".env.local");
let urlRef = null;
if (!local) err("الملف .env.local مش موجود");
else {
  for (const k of Object.keys(local)) {
    if (/SECRET|SERVICE|TOKEN|PASSWORD|PRIVATE/i.test(k)) err(`${k} ما ينفعش يكون هنا (الملف ده بيوصل للمتصفح)`);
    else if (!k.startsWith("VITE_")) warn(`${k} مش بيبدأ بـ VITE_ فمش هيظهر للتطبيق`);
  }
  if (need(local, "VITE_SUPABASE_URL", ".env.local")) {
    const m = local.VITE_SUPABASE_URL.match(/^https:\/\/([a-z0-9]{20})\.supabase\.co\/?$/);
    if (m) { urlRef = m[1]; ok(`VITE_SUPABASE_URL شكله سليم (ref: ${m[1].slice(0, 4)}…)`); }
    else warn("VITE_SUPABASE_URL شكله مش المعتاد (https://<20 حرف>.supabase.co)");
  }
  if (need(local, "VITE_SUPABASE_ANON_KEY", ".env.local")) {
    const key = local.VITE_SUPABASE_ANON_KEY;
    const role = jwtRole(key);
    if (role === "service_role" || key.startsWith("sb_secret_")) err("ده مفتاح سري (service_role) في ملف المتصفح! شيله فورًا وغيّره من لوحة Supabase");
    else if (role === "anon" || key.startsWith("sb_publishable_")) ok(`VITE_SUPABASE_ANON_KEY مفتاح عام صحيح (${mask(key)})`);
    else warn("VITE_SUPABASE_ANON_KEY مش واضح نوعه: اتأكد إنه anon/publishable");
  }
  if (need(local, "VITE_CLOUDINARY_CLOUD_NAME", ".env.local")) {
    /\s/.test(local.VITE_CLOUDINARY_CLOUD_NAME) ? err("VITE_CLOUDINARY_CLOUD_NAME فيه مسافات") : ok(`VITE_CLOUDINARY_CLOUD_NAME موجود (${mask(local.VITE_CLOUDINARY_CLOUD_NAME)})`);
  }
}

// ---------- .env.admin (أدوات محلية) ----------
console.log("\n[.env.admin] أدوات Supabase على جهازك");
const admin = load(".env.admin");
if (!admin) err("الملف .env.admin مش موجود");
else {
  if (need(admin, "SUPABASE_ACCESS_TOKEN", ".env.admin")) {
    admin.SUPABASE_ACCESS_TOKEN.startsWith("sbp_") ? ok(`SUPABASE_ACCESS_TOKEN موجود (${mask(admin.SUPABASE_ACCESS_TOKEN)})`) : warn("SUPABASE_ACCESS_TOKEN مش بيبدأ بـ sbp_ (اتأكد إنه Personal Access Token)");
  }
  if (need(admin, "SUPABASE_PROJECT_REF", ".env.admin")) {
    if (urlRef && admin.SUPABASE_PROJECT_REF !== urlRef) err("SUPABASE_PROJECT_REF مختلف عن المشروع في VITE_SUPABASE_URL (مشروعين مختلفين؟)");
    else ok("SUPABASE_PROJECT_REF موجود" + (urlRef ? " ومطابق للرابط" : ""));
  }
  if (need(admin, "SUPABASE_DB_PASSWORD", ".env.admin")) {
    admin.SUPABASE_DB_PASSWORD.length < 12 ? warn("باسورد قاعدة البيانات قصير (أقل من 12 حرف)") : ok("SUPABASE_DB_PASSWORD موجود");
  }
}

// ---------- .env.secrets (أسرار Edge Functions) ----------
console.log("\n[.env.secrets] أسرار الدوال (Cloudinary / Google)");
const secrets = load(".env.secrets");
if (!secrets) err("الملف .env.secrets مش موجود");
else {
  for (const k of Object.keys(secrets)) if (k.startsWith("SUPABASE_")) err(`${k}: Supabase بيرفض أسرار أولها SUPABASE_ (حطه في .env.admin)`);
  if (need(secrets, "CLOUDINARY_CLOUD_NAME", ".env.secrets") && local?.VITE_CLOUDINARY_CLOUD_NAME) {
    secrets.CLOUDINARY_CLOUD_NAME === local.VITE_CLOUDINARY_CLOUD_NAME ? ok("CLOUDINARY_CLOUD_NAME مطابق للمتصفح") : err("CLOUDINARY_CLOUD_NAME مختلف عن VITE_CLOUDINARY_CLOUD_NAME");
  }
  if (need(secrets, "CLOUDINARY_API_KEY", ".env.secrets")) /^\d{12,18}$/.test(secrets.CLOUDINARY_API_KEY) ? ok(`CLOUDINARY_API_KEY شكله سليم (${mask(secrets.CLOUDINARY_API_KEY)})`) : warn("CLOUDINARY_API_KEY المفروض أرقام فقط (حوالي 15 رقم)");
  if (need(secrets, "CLOUDINARY_API_SECRET", ".env.secrets")) secrets.CLOUDINARY_API_SECRET.length < 20 ? warn("CLOUDINARY_API_SECRET قصير: اتأكد إنك نسخته كامل") : ok("CLOUDINARY_API_SECRET موجود");
  const g = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GOOGLE_REFRESH_TOKEN"];
  const have = g.filter((k) => secrets[k]);
  const missingGoogle = g.filter((k) => !secrets[k]);
  if (have.length === 0) warn("مفاتيح Google مش موجودة (اختيارية: لعداد مساحة Drive، وتتعمل آخر مرحلة)");
  else if (missingGoogle.length === 1 && missingGoogle[0] === "GOOGLE_REFRESH_TOKEN") {
    secrets.GOOGLE_CLIENT_ID.endsWith(".apps.googleusercontent.com") ? ok("GOOGLE_CLIENT_ID شكله سليم") : warn("GOOGLE_CLIENT_ID مش بينتهي بـ .apps.googleusercontent.com");
    warn("GOOGLE_REFRESH_TOKEN لسه فاضي: ده طبيعي، بيتعمل آخر مرحلة (عداد Drive) بموافقة منك في المتصفح");
  } else if (missingGoogle.length > 0) err(`مفاتيح Google ناقصة: ${missingGoogle.join(", ")}`);
  else {
    secrets.GOOGLE_CLIENT_ID.endsWith(".apps.googleusercontent.com") ? ok("GOOGLE_CLIENT_ID شكله سليم") : warn("GOOGLE_CLIENT_ID مش بينتهي بـ .apps.googleusercontent.com");
    ok("GOOGLE_CLIENT_SECRET وGOOGLE_REFRESH_TOKEN موجودين");
  }
}

// ---------- .gitignore ----------
console.log("\n[.gitignore] حماية الملفات من الرفع على Git");
const ignore = existsSync(".gitignore") ? readFileSync(".gitignore", "utf8").split(/\r?\n/).map((l) => l.trim()) : [];
const covered = (n) => ignore.some((l) => l === n || l === `${n}*` || (l === "*.local" && n === ".env.local") || l === ".env*");
for (const n of [".env", ".env.local", ".env.admin", ".env.secrets"]) covered(n) ? ok(`${n} متجاهل`) : err(`${n} مش في .gitignore: ضيفه قبل أي commit`);

console.log(`\nالنتيجة: ${errors} خطأ، ${warnings} تحذير.${errors ? " صلّح الأخطاء قبل ما تدّي الملفات للـ AI." : " جاهز."}\n`);
process.exit(errors ? 1 : 0);
