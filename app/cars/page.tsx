import { createServerClient } from "@/lib/supabase"

export default async function CarsPage() {
  const supabase = createServerClient()

  const { data: cars, error } = await supabase.from("cars").select("*").eq("status", "available")

  if (error) {
    console.error("Ошибка при загрузке автомобилей:", error)
    return <div>Произошла ошибка при загрузке данных</div>
  }

  return (
    <div>
      <h1>Доступные автомобили</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cars.map((car) => (
          <div key={car.id} className="border p-4 rounded">
            <h2>
              {car.make} {car.model} ({car.year})
            </h2>
            <p>{car.price_per_day} тенге/день</p>
            <p>Город: {car.city}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
