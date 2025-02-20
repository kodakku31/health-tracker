export default function DashboardPage() {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">ダッシュボード</h1>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        {/* ダッシュボードの内容をここに追加 */}
        <div className="py-4">
          <div className="h-96 rounded-lg border-4 border-dashed border-gray-200">
            <div className="flex h-full items-center justify-center">
              <p className="text-gray-500">ダッシュボードのコンテンツは準備中です</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
