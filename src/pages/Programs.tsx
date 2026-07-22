import PageLayout, { ContentCard } from '../components/PageLayout'

export default function Programs() {
  return (
    <PageLayout
      label="Programs"
      titleSegments={[
        { text: 'Structured paths for', className: 'font-normal' },
        { text: 'unstructured minds.', className: 'italic font-serif' },
      ]}
      intro="Longer-form journeys through the craft, from first short to festival submission — each one built around your own project."
    >
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-2 md:gap-1">
        <ContentCard index={0} title="The Residency — 12 weeks.">
          Develop one project from treatment to final cut with a dedicated mentor and a
          cohort of eight.
        </ContentCard>
        <ContentCard index={1} title="The Exchange — 6 weeks.">
          Pair with an artist in another discipline and remake each other's work. Leave
          with new eyes.
        </ContentCard>
        <ContentCard index={2} title="The Festival Track — ongoing.">
          Submission strategy, deliverables, and press kits for work headed to the
          international circuit.
        </ContentCard>
      </div>
    </PageLayout>
  )
}
