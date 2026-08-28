const RESTAURANTS = ["Burger & Bread", "Tasty Vine Kitchen", "Cresta", "Mama Cass", "Chicken Republic"];
export default function RestaurantsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-[#1A153B]">Restaurants</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {RESTAURANTS.map((r) => (
          <div key={r} className="bg-white rounded-2xl border border-gray-100 p-5"><p className="font-bold text-[#1A153B]">{r}</p><p className="text-xs text-gray-500 mt-1">Sales • levy 10%</p></div>
        ))}
      </div>
    </div>
  );
}
