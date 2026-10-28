export default function Loading() {
  return (
    <div aria-busy="true">
      <div className="h-[52vh] min-h-[300px] animate-pulse bg-horizon" />
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-16 sm:px-6 md:px-8">
        <div className="h-3 w-32 animate-pulse bg-sky-100" />
        <div className="h-9 w-2/3 animate-pulse bg-sky-100" />
        <div className="h-4 w-full animate-pulse bg-sky-100" />
        <div className="h-4 w-5/6 animate-pulse bg-sky-100" />
      </div>
    </div>
  );
}
