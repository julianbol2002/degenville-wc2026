import PageSkeleton from "@/components/PageSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-bg transition-colors duration-300">
      <PageSkeleton />
    </div>
  );
}
