export default function MasterTabs({ tabs, activeTab, onChange }) {
  return (
    <div
      role="tablist"
      className="mb-6 flex gap-2 overflow-x-auto rounded-2xl border border-white/10 bg-[#0c1a2b] p-1.5"
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === activeTab}
          onClick={() => onChange(tab.id)}
          className={
            "flex min-h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 text-sm font-extrabold transition " +
            (tab.id === activeTab
              ? "bg-gold text-midnight"
              : "text-white/55 hover:bg-white/[0.04] hover:text-white")
          }
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={
                "rounded-md px-2 py-0.5 text-xs " +
                (tab.id === activeTab ? "bg-midnight/15" : "bg-white/[0.06]")
              }
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
