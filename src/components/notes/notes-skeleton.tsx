export function NotesSkeleton() {
    return (
        <div className="space-y-6">
            {/* Filters Skeleton */}
            <div className="flex flex-wrap items-center gap-3">
                <div className="h-10 w-[180px] rounded-md skeleton" />
                <div className="h-10 w-[140px] rounded-md skeleton" />
                <div className="h-10 w-[160px] rounded-md skeleton" />
            </div>

            {/* Cards Skeleton */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-48 rounded-lg skeleton" />
                ))}
            </div>
        </div>
    );
}
