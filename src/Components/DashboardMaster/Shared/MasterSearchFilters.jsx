import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function MasterSearchFilters({ search, onSearchChange, searchPlaceholder = "ابحث...", filters = [] }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">{searchPlaceholder}</span>
        <FontAwesomeIcon icon={faMagnifyingGlass} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/35" />
        <input value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder={searchPlaceholder} className="h-12 w-full rounded-xl border border-white/10 bg-[#091625] pr-11 pl-4 text-sm font-bold text-white outline-none transition placeholder:text-white/30 focus:border-gold/40" />
      </label>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex">
        {filters.map((filter) => (
          <label key={filter.id} className="flex min-w-0 items-center gap-2 rounded-xl border border-white/10 bg-[#091625] px-3">
            <span className="shrink-0 text-xs font-bold text-white/40">{filter.label}</span>
            <select value={filter.value} onChange={(event) => filter.onChange(event.target.value)} aria-label={filter.label} className="h-12 min-w-0 flex-1 bg-transparent text-sm font-bold text-white outline-none">
              {filter.options.map((option) => <option key={option.value} value={option.value} className="bg-[#0c1a2b] text-white">{option.label}</option>)}
            </select>
          </label>
        ))}
      </div>
    </div>
  );
}
