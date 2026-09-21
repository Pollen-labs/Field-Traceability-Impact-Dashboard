/**
 * Interface for the Card component props
 * @property {string} image - Image filename (without extension) for the illustration
 * @property {string} title - Card heading text
 * @property {string} description - HTML content for card description (supports links and formatting)
 */
interface CardProps {
  image: string;
  title: string;
  description: string
}

/**
 * Card - Informational card component used on the About page
 * 
 * Displays a visual explanation of a concept or process with:
 * - Illustrative SVG image
 * - Title heading
 * - Rich text description (supporting HTML for links and formatting)
 * 
 * The cards are used in the About page to explain the hub workflow
 * in a visually appealing, step-by-step format.
 */
const Card = ({ image, title, description }: CardProps) => {
  return (
    <article className="flex flex-col items-center gap-4 md:gap-2 w-full border border-black rounded-3xl">
      {/* Illustration from SVG file */}
      <img 
        src={`/illustrations/${image}.svg`} 
        alt={`illustration of ${image}`} 
        loading="lazy"
        className="h-[200px] w-[200px] py-2"/>
      {/* Content container with title and description */}
      <div className="pb-8 pl-6 pr-3 text-left">
        {/* Card title */}
        <h3 className="font-semibold text-xl tracking-tight pb-2">{title}</h3>
        {/* Description with HTML support */}
        {/* Note: dangerouslySetInnerHTML is used to support links and formatting in the description */}
        <p className="font-extralight text-lg tracking-tight" dangerouslySetInnerHTML={{__html: description}}></p>
      </div>
    </article>
  )
}

export { Card }