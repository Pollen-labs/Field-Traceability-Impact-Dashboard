/**
 * MapSkeleton - Simple static skeleton loader for ActivityMap component
 * 
 * Displays a static gray/beige placeholder rectangle that mimics the map container.
 * No animations - just a simple, clean placeholder.
 * 
 * Features:
 * - Matches map container dimensions
 * - Static placeholder (no animations)
 * - Uses sand color from design system
 */
const MapSkeleton = () => {
  return (
    <article className="w-full h-[400px] md:h-[500px] lg:h-[700px] pt-3 overflow-hidden rounded-3xl">
      {/* Simple static gray/beige rectangle - no animations */}
      <div className="w-full h-full bg-sand rounded-3xl" />
    </article>
  )
}

export { MapSkeleton }

