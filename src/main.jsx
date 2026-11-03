import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import { ArrowRight, CalendarDays, ChevronRight, MapPin, Menu, Search, Share2 } from "lucide-react";
import TourismMap, { googleMapsUrl, hasCoordinates } from "./TourismMap";
import "./index.css";
import placesData from "./data/places.json";

const LOCAL_DATA_KEY = "wanderly_demo_places";

function useContent() {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_DATA_KEY);
      return saved ? JSON.parse(saved) : placesData;
    } catch {
      return placesData;
    }
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_DATA_KEY, JSON.stringify(items));
  }, [items]);

  return { items, setItems };
}

function Header() {
  return (
    <header className="absolute top-0 z-20 w-full text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link to="/" className="text-xl font-black tracking-tight">
          COLIMA <span className="text-gold">EN EL MAPA</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-semibold md:flex">
          <Link to="/explorar">Explorar</Link>
          <a href="#destacados">Destacados</a>
          <Link to="/admin">Administración</Link>
        </nav>
        <Menu className="md:hidden" />
      </div>
    </header>
  );
}

function Hero({ items }) {
  const navigate = useNavigate();
  const placesCount = items.filter((item) => item.active).length;

  return (
    <>
      <section className="relative flex min-h-[650px] items-center overflow-hidden bg-royal">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,30,75,.9),rgba(13,71,161,.45)),url('https://images.unsplash.com/photo-1500534623283-312aade485b7?w=1800')] bg-cover bg-center" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pt-16">
          <p className="mb-5 font-bold uppercase tracking-[.25em] text-gold">
            Una guía para descubrirlo
          </p>
          <h1 className="display max-w-2xl text-6xl font-bold leading-[.95] md:text-8xl">
            Descubre tu
            <br />
            <span className="text-gold">estado.</span>
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-blue-50">
            Lugares que vale la pena encontrar. Explora la naturaleza, la cultura y los sabores que
            hacen único a Colima.
          </p>
          <button
            onClick={() => navigate("/explorar")}
            className="mt-9 flex items-center gap-3 rounded-full bg-gold px-7 py-4 font-bold text-royal shadow-xl transition hover:scale-105"
          >
            Explorar el mapa <ArrowRight size={19} />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-sand to-transparent" />
      </section>

      <div className="relative mx-auto -mt-20 max-w-6xl px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-xl md:col-span-2">
            <p className="mb-1 text-xs font-bold uppercase tracking-widest text-volcano">
              Lugares para descubrir
            </p>
            <h2 className="text-2xl font-bold">{placesCount} puntos en el mapa</h2>
            <p className="mt-2 text-slate-500">
              Lugares turísticos, tianguis, mercados y ejemplos culturales
            </p>
          </div>
          <button
            onClick={() => navigate("/explorar")}
            className="flex items-center justify-between rounded-2xl bg-palm p-6 text-left font-bold text-white shadow-xl"
          >
            Explora las ubicaciones <ArrowRight />
          </button>
        </div>
      </div>
    </>
  );
}

function Card({ item }) {
  return (
    <Link
      to={`/lugar/${item.slug}`}
      className="group overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <img
        src={item.image}
        className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
        alt={item.name}
      />
      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-volcano">{item.type}</p>
        <h3 className="mt-2 text-xl font-bold text-royal">{item.name}</h3>
        <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
          <MapPin size={14} />
          {item.municipality}
        </p>
      </div>
    </Link>
  );
}

function Home({ items }) {
  const featured = items.filter((item) => item.active && item.featured);

  return (
    <>
      <Header />
      <Hero items={items} />
      <section className="mx-auto max-w-6xl px-6 pt-16">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="font-bold uppercase tracking-widest text-volcano">Empieza aquí</p>
            <h2 className="display mt-2 text-3xl font-bold text-royal">Lugares en el mapa</h2>
          </div>
          <Link to="/explorar" className="flex items-center gap-1 font-bold text-royal">
            Explorar <ChevronRight size={18} />
          </Link>
        </div>
        <div className="relative h-72 overflow-hidden rounded-3xl bg-[#dce9de] shadow-sm sm:h-80">
          <TourismMap items={featured} compact />
          <p className="pointer-events-none absolute bottom-4 left-4 z-[500] rounded-full bg-white px-4 py-2 text-xs font-bold text-royal shadow">
            Toca un punto para verlo en Google Maps
          </p>
        </div>
      </section>
      <main id="destacados" className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="font-bold uppercase tracking-widest text-volcano">
              Una selección especial
            </p>
            <h2 className="display mt-2 text-4xl font-bold text-royal md:text-5xl">
              Lugares destacados
            </h2>
          </div>
          <Link
            to="/explorar"
            className="hidden font-bold text-royal md:flex md:items-center md:gap-2"
          >
            Ver todos <ChevronRight size={18} />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featured.map((item) => (
            <Card key={item.slug} item={item} />
          ))}
        </div>
      </main>
    </>
  );
}

function Explore({ items }) {
  const [types, setTypes] = useState(["Turismo", "Tianguis", "Mercados", "Eventos"]);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const matchesType = types.includes(item.type);                            
        const searchable = `${item.name} ${item.municipality} ${item.description}`.toLowerCase();
        return item.active && matchesType && searchable.includes(query.toLowerCase());
      }),
    [items, types, query]
  );

  const toggleType = (type) => {
    setTypes((current) =>
      current.includes(type) ? current.filter((item) => item !== type) : [...current, type]
    );
  };

  return (
    <>
      <Header />
      <div className="bg-royal px-6 pb-16 pt-32 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="font-bold uppercase tracking-widest text-gold">Explora Colima</p>
          <h1 className="display mt-3 text-5xl font-bold">Encuentra tu siguiente lugar.</h1>
          <div className="mt-8 flex max-w-2xl items-center gap-3 rounded-xl bg-white px-4 py-3 text-slate-500">
            <Search size={20} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Busca por nombre, municipio o palabra clave"
              className="w-full outline-none"
            />
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 flex flex-wrap gap-2">
          {["Turismo", "Tianguis", "Mercados", "Eventos"].map((type) => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={`rounded-full border px-5 py-2 text-sm font-bold ${
                types.includes(type)
                  ? "border-royal bg-royal text-white"
                  : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="order-2 grid gap-5 sm:grid-cols-2 lg:order-1">
            {filtered.map((item) => (
              <Card key={item.slug} item={item} />
            ))}
          </div>

          <div className="relative order-1 h-[520px] overflow-hidden rounded-3xl bg-[#dce9de] lg:sticky lg:top-6 lg:order-2">
            <TourismMap items={filtered} />
            <p className="pointer-events-none absolute bottom-4 left-4 z-[500] rounded-full bg-white px-4 py-2 text-xs font-bold text-royal shadow">
              Toca un punto para verlo en Google Maps
            </p>
          </div>
        </div>

        {!filtered.length && (
          <p className="py-16 text-center text-slate-500">
            No encontramos resultados. Intenta limpiar tus filtros.
          </p>
        )}
      </main>
    </>
  );
}

function Detail({ items }) {
  const { slug } = useParams();
  const inactive = items.some((entry) => entry.slug === slug && !entry.active);
  const initialItem = inactive ? null : items.find((entry) => entry.slug === slug) || null;
  const item = initialItem;

  if (!item || inactive) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-sand px-6 text-center">
        <h1 className="display text-4xl font-bold text-royal">Contenido no disponible</h1>
        <Link to="/explorar" className="mt-6 rounded-full bg-royal px-6 py-3 font-bold text-white">
          Explorar lugares
        </Link>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="relative h-[440px] bg-royal">
        <img src={item.image} className="h-full w-full object-cover opacity-70" alt={item.name} />
        <div className="absolute inset-0 bg-gradient-to-t from-royal to-transparent" />
        <div className="absolute bottom-12 left-0 w-full px-6 text-white">
          <div className="mx-auto max-w-4xl">
            <p className="font-bold uppercase tracking-widest text-gold">
              {item.type} · {item.municipality}
            </p>
            <h1 className="display mt-3 text-5xl font-bold md:text-7xl">{item.name}</h1>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-6 py-14">
        <div className="grid gap-12 md:grid-cols-[1fr_280px]">
          <article>
            <p className="text-xl leading-relaxed text-slate-600">{item.description}</p>
            <h2 className="display mt-10 text-3xl font-bold text-royal">Vale la pena conocerlo</h2>
            <p className="mt-4 leading-8 text-slate-600">
              Este espacio forma parte de la selección de lugares para descubrir Colima. Encuentra
              información práctica, disfruta el recorrido y comparte este lugar con quien quieras
              visitar.
            </p>
            <button
              onClick={() => navigator.share?.({ title: item.name, url: location.href })}
              className="mt-8 flex items-center gap-2 rounded-full bg-royal px-5 py-3 font-bold text-white"
            >
              <Share2 size={17} /> Compartir
            </button>
          </article>

          <aside className="h-fit rounded-2xl bg-white p-6 shadow-lg">
            <p className="font-bold text-royal">Información práctica</p>
            <p className="mt-5 flex gap-3 text-sm">
              <MapPin className="text-volcano" size={18} />
              {item.municipality}, Colima
            </p>
            <p className="mt-4 flex gap-3 text-sm">
              <CalendarDays className="text-palm" size={18} />
              {item.schedule}
            </p>
            {item.location_note && (
              <p className="mt-5 rounded-lg bg-amber-50 p-3 text-sm leading-6 text-amber-900">
                {item.location_note}
              </p>
            )}
            {hasCoordinates(item) && (
              <>
                <div className="mt-6 h-56 overflow-hidden rounded-xl bg-[#dce9de]">
                  <TourismMap items={[item]} compact />
                </div>
                <a
                  href={googleMapsUrl(item)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex items-center gap-2 font-bold text-royal"
                >
                  <MapPin size={17} /> Ver en Google Maps <ArrowRight size={17} />
                </a>
              </>
            )}
          </aside>
        </div>
      </main>
    </>
  );
}

function Admin({ items, setItems }) {
  const navigate = useNavigate();
  const [adminQuery, setAdminQuery] = useState("");



  const filteredAdminItems = useMemo(() => {
    const search = adminQuery.trim().toLowerCase();

    if (!search) {
      return items;
    }

    return items.filter((item) => {
      const searchable = `${item.name} ${item.type} ${item.municipality} ${item.description}`
        .toLowerCase();
      return searchable.includes(search);
    });
  }, [adminQuery, items]);

  const activeCount = items.filter((item) => item.active).length;
  const inactiveCount = items.length - activeCount;

  const toggleActive = (item) => {
    const nextActive = !item.active;
    setItems((current) =>
      current.map((currentItem) =>
        currentItem.slug === item.slug ? { ...currentItem, active: nextActive } : currentItem
      )
    );
  };

  const handleLogout = () => navigate("/");



  return (
    <div className="min-h-screen bg-slate-100">
      <div className="bg-royal px-6 py-5 text-white">
        <div className="mx-auto flex max-w-6xl justify-between">
          <Link to="/" className="font-black">
            COLIMA EN EL MAPA
          </Link>
          <div className="flex items-center gap-5 text-sm">
            <Link to="/">Ver sitio público</Link>
            <button onClick={handleLogout} className="font-bold text-gold">
              Salir de administración
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-sm font-bold uppercase tracking-widest text-volcano">Administración</p>
        <h1 className="display mt-2 text-5xl font-bold text-royal">Contenido</h1>
        <p className="mt-3 text-sm text-slate-500">
          {activeCount} activos · {inactiveCount} inactivos
        </p>
        <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          Esta es una administración de demostración, sin autenticación ni sincronización. Los cambios se guardan en este navegador y no modifican el JSON del repositorio.
        </p>
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <input
              value={adminQuery}
              onChange={(event) => setAdminQuery(event.target.value)}
              className="rounded-lg border px-4 py-2"
              placeholder="Buscar contenido..."
            />
            <div className="flex flex-wrap items-center gap-3"><p className="text-xs text-slate-500">Los cambios son locales a este navegador.</p><button onClick={() => { if (window.confirm("¿Restaurar el catálogo original de la demo?")) setItems(placesData); }} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-royal">Restaurar datos iniciales</button></div>
          </div>

          {filteredAdminItems.map((item) => (
            <div className="flex items-center justify-between border-t py-4" key={item.slug}>
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-slate-500">
                  {item.type} · {item.municipality}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    item.active ? "bg-green-100 text-palm" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {item.active ? "Activo" : "Inactivo"}
                </span>
                <button onClick={() => toggleActive(item)} className="text-sm font-bold text-royal">
                  {item.active ? "Desactivar" : "Activar"}
                </button>
              </div>
            </div>
          ))}

          {!filteredAdminItems.length && (
            <p className="border-t py-10 text-center text-sm text-slate-500">
              No encontramos contenido con esa búsqueda.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

function AdminLogin() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen items-center justify-center bg-royal px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-widest text-volcano">Administración de demo</p>
        <h1 className="display mt-2 text-4xl font-bold text-royal">Acceso de demostración</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">No requiere servidor ni credenciales. Los cambios se guardan en el almacenamiento local de este navegador.</p>
        <button onClick={() => navigate("/admin")} className="mt-7 w-full rounded-lg bg-royal px-5 py-3 font-bold text-white">Entrar a administración</button>
      </div>
    </div>
  );
}

function App() {
  const { items, setItems } = useContent();

  return (
    <Routes>
      <Route path="/" element={<Home items={items} />} />
      <Route path="/explorar" element={<Explore items={items} />} />
      <Route path="/lugar/:slug" element={<Detail items={items} />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<Admin items={items} setItems={setItems} />} />
    </Routes>
  );
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
