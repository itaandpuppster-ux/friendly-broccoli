import PageLayout, { ContentCard } from '../components/PageLayout'

export default function Collective() {
  return (
    <PageLayout
      label="Collective"
      titleSegments={[
        { text: 'A network of', className: 'font-normal' },
        { text: 'visionaries,', className: 'italic font-serif' },
        { text: 'not a roster of names.', className: 'font-normal' },
      ]}
      intro="Directors, cinematographers, editors, and sound designers — bound not by place, status or labels, but by hunger to make work that matters."
    >
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 md:gap-1">
        <ContentCard index={0} title="Directors.">
          Storytellers who see the whole before the parts, shaping narrative from chaos.
        </ContentCard>
        <ContentCard index={1} title="Cinematographers.">
          Painters of light who turn locations into worlds and moments into memory.
        </ContentCard>
        <ContentCard index={2} title="Editors & colorists.">
          The unseen hands that give footage its rhythm, tone, and emotional temperature.
        </ContentCard>
        <ContentCard index={3} title="Sound designers.">
          Architects of atmosphere who make the frame felt as much as seen.
        </ContentCard>
      </div>
    </PageLayout>
  )
}
