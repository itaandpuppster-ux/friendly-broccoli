import PageLayout, { ContentCard } from '../components/PageLayout'

export default function Inquiries() {
  return (
    <PageLayout
      label="Inquiries"
      titleSegments={[
        { text: "Let's make", className: 'font-normal' },
        { text: 'something', className: 'italic font-serif' },
        { text: 'together.', className: 'font-normal' },
      ]}
      intro="Commissions, collaborations, press, or joining the lab — tell us what you're dreaming about and we'll find the right people."
    >
      <div className="mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-2 md:gap-1">
        <ContentCard index={0} title="Commissions.">
          Brand films, music videos, and title sequences crafted by collective members.
          Write to studio@prisma.example.
        </ContentCard>
        <ContentCard index={1} title="Join the lab.">
          Applications open quarterly. Send a reel and a short note on what you're hungry
          to learn to join@prisma.example.
        </ContentCard>
        <ContentCard index={2} title="Press & partnerships.">
          Festivals, publications, and institutions — reach the team at
          press@prisma.example.
        </ContentCard>
      </div>
    </PageLayout>
  )
}
