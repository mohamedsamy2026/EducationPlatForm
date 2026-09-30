import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInbox } from "@fortawesome/free-solid-svg-icons";
export default function MasterEmptyState({ title, description, icon = faInbox, children }) {
 return <div className="rounded-2xl border border-dashed border-white/10 bg-[#0c1a2b] px-6 py-12 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10 text-gold"><FontAwesomeIcon icon={icon}/></span><h2 className="mt-4 text-base font-black text-white">{title}</h2>{description && <p className="mx-auto mt-2 max-w-lg text-sm font-bold leading-7 text-white/45">{description}</p>}{children}</div>;
}
