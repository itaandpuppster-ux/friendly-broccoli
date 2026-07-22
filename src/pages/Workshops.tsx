import PageLayout, { ContentCard } from '../components/PageLayout'

export default function Workshops() {
  return (
    <PageLayout
      label="Workshops"
      titleSegments={[
        { text: 'Learn by', className: 'font-normal' },
        { text: 'making,', className: 'italic font-serif' },
        { text: 'not by watching.', className: 'font-normal' },
      ]}
      intro="Hands-on sessions led by working artists. Small groups, real footage, honest critique — the way craft has always been passed on."
    >
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-2 md:gap-1">
        <ContentCard index={0} title="Color grading intensives.">
          A week inside the grade: building looks, matching shots, and protecting skin
          tones under pressure.
        </ContentCard>
        <ContentCard index={1} title="Visual effects labs.">
          Practical compositing and invisible effects — learning when to add and, more
          often, when to take away.
        </ContentCard>
        <ContentCard index={2} title="Narrative design studios.">
          Structure, subtext, and pacing workshopped scene by scene with a room full of
          honest collaborators.
        </ContentCard>
      </div>
    </PageLayout>
  )
}
