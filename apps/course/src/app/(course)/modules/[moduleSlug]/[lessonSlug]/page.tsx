export default function LessonPage({
  params,
}: {
  params: Promise<{ moduleSlug: string; lessonSlug: string }>;
}) {
  return (
    <div className="mx-auto max-w-[720px]">
      <h1 className="font-heading text-3xl text-primary">Lesson</h1>
      <p className="mt-2 text-text-muted">Lesson page placeholder.</p>
    </div>
  );
}
