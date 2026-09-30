import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function MasterStatCard({ label, value, icon, note }) {
 return <section className="rounded-2xl border border-white/10 bg-[#0c1a2b] p-5 shadow-[0_15px_45px_rgba(0,0,0,0.12)]"><div className="flex items-start justify-between gap-4"><div className="min-w-0"><p className="text-sm font-bold text-white/50">{label}</p><p className="mt-3 text-3xl font-black text-white">{value}</p>{note && <p className="mt-2 text-xs font-bold leading-6 text-white/40">{note}</p>}</div><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold"><FontAwesomeIcon icon={icon}/></span></div></section>;
}
