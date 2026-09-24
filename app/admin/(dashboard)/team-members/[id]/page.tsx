import MediaEntityForm from "../../_components/MediaEntityForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditTeamMemberPage({ params }: PageProps) {
  const { id } = await params;
  return <MediaEntityForm id={id} kind="teamMember" />;
}

