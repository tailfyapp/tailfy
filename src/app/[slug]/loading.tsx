export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto">
        {/* Cover skeleton */}
        <div className="h-48 sm:h-56 bg-gray-200 rounded-b-3xl animate-pulse" />

        {/* Card skeleton */}
        <div className="px-4 sm:px-6 -mt-16 relative z-10">
          <div className="bg-white rounded-2xl shadow-sm p-6 pt-16">
            <div className="absolute -top-12 left-10">
              <div className="w-24 h-24 rounded-full bg-gray-200 animate-pulse" />
            </div>
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-gray-100 rounded animate-pulse mb-3" />
            <div className="space-y-2">
              <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Services skeleton */}
        <div className="px-4 sm:px-6 mt-6 space-y-3">
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse mb-4" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm p-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse" />
                <div className="flex-1">
                  <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 w-full bg-gray-100 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
