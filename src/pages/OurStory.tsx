import PageLayout, { ContentCard } from '../components/PageLayout'

export default function OurStory() {
  return (
    <PageLayout
      label="Our story"
      titleSegments={[
        { text: 'Born from', className: 'font-normal' },
        { text: 'restless curiosity.', className: 'italic font-serif' },
      ]}
      intro="Prisma began as a handful of filmmakers trading rough cuts across time zones. Today it is a worldwide network bound by passion, not geography."
    >
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-2 md:gap-1">
        <ContentCard index={0} title="2019 — The first frame.">
          Three artists, one shared drive, and an obsession with light. What started as
          weekend critiques became a ritual that never stopped.
        </ContentCard>
        <ContentCard index={1} title="2022 — Going worldwide.">
          The collective opened its doors beyond borders. Filmmakers, colorists, and
          storytellers from six continents joined the lab.
        </ContentCard>
        <ContentCard index={2} title="Today — Still hungry.">
          Hundreds of members, festival-recognized work, and the same founding belief:
          potential is unlocked through unique perspectives.
        </ContentCard>
      </div>
    </PageLayout>
  )
}
