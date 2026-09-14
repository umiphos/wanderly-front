import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  ChevronRight,
  MapPin,
  Menu,
  Search,
  Share2,
} from "lucide-react";
import "./index.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";
const ADMIN_TOKEN_KEY = "wanderly_admin_token";

const fallbackData = [
  [
    "comala-pueblo-magico",
    "Comala, pueblo mágico",
    "Turismo",
    "Comala",
    "Calles blancas, portales y la atmósfera que inspiró a Juan Rulfo.",
    "https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1000",
  ],
  [
    "volcan-de-fuego",
    "Volcán de Fuego",
    "Turismo",
    "Comala",
    "El paisaje emblemático de Colima y una vista inolvidable del occidente.",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1000",
  ],
  [
    "playa-la-boquita",
    "Playa La Boquita",
    "Turismo",
    "Manzanillo",
    "Bahía tranquila, gastronomía local y atardeceres frente al Pacífico.",
    "https://images.unsplash.com/photo-1507521428034-b723cf961d3e?w=1000",
  ],
  [
    "jardin-libertad",
    "Jardín Libertad",
    "Turismo",
    "Colima",
    "El corazón del centro histórico de la ciudad de Colima.",
    "https://images.unsplash.com/photo-1531058020387-3be344556be6?w=1000",
  ],
  [
    "laguna-la-maria",
    "Laguna La María",
    "Turismo",
    "Comala",
    "Un espacio natural para caminar, respirar y disfrutar el paisaje.",
    "https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1000",
  ],
  [
    "museo-regional-historia",
    "Museo Regional de Historia",
    "Turismo",
    "Colima",
    "Conoce la historia y las expresiones culturales de la región.",
    "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=1000",
  ],
  [
    "tianguis-villa-alvarez",
    "Tianguis de Villa de Álvarez",
    "Tianguis",
    "Villa de Álvarez",
    "Sabores, productos y encuentro comunitario cada semana.",
    "https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1000",
  ],
  [
    "tianguis-artesanal-comala",
    "Tianguis artesanal de Comala",
    "Tianguis",
    "Comala",
    "Artesanías y productos locales en fechas especiales.",
    "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?w=1000",
  ],
  [
    "mercado-obregon",
    "Mercado Constitución",
    "Mercados",
    "Colima",
    "Un recorrido por los sabores cotidianos de la capital.",
    "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1000",
  ],
  [
    "feria-cultura-colima",
    "Festival de Cultura Colima",
    "Eventos",
    "Colima",
    "Música, danza y expresiones artísticas de la región.",
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1000",
  ],
].map(([slug, name, type, municipality, description, image], index) => ({
  slug,
  name,
  type,
  municipality,
  description,
  image,
  featured: index < 3,
  active: true,
  schedule:
    type === "Tianguis"
      ? "Domingos · 08:00-14:00"
      : type === "Eventos"
        ? "18 oct 2026 · 18:00"
        : "Abierto hoy · 10:00-17:00",
}));

async function apiRequest(path, options) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);

  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }

  return response.json();
}

function useContent() {
  const [items, setItems] = useState(fallbackData);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let ignore = false;

    apiRequest("/api/content")
      .then((rows) => {
        if (!ignore) {
          setItems(rows);
          setStatus("ready");
        }
      })
      .catch(() => {
        if (!ignore) {
          setItems(fallbackData);
          setStatus("fallback");
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  return { items, setItems, status };
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

function Hero() {
  const navigate = useNavigate();

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
            Lugares que vale la pena encontrar. Explora la naturaleza, la cultura y los sabores
            que hacen único a Colima.
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
              Para este fin de semana
            </p>
            <h2 className="text-2xl font-bold">4 planes cerca de ti</h2>
            <p className="mt-2 text-slate-500">2 lugares · 1 tianguis · 1 evento</p>
          </div>
          <button
            onClick={() => navigate("/explorar")}
            className="flex items-center justify-between rounded-2xl bg-palm p-6 text-left font-bold text-white shadow-xl"
          >
            Traza tu propia ruta <ArrowRight />
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
  return (
    <>
      <Header />
      <Hero />
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
          {items
            .filter((item) => item.featured)
            .map((item) => (
              <Card key={item.slug} item={item} />
            ))}
        </div>
      </main>
    </>
  );
}

function Explore({ items }) {
  const [types, setTypes] = useState(["Turismo"]);
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const matchesType = types.length === 0 || types.includes(item.type);
        const searchable = `${item.name} ${item.municipality} ${item.description}`.toLowerCase();
        return matchesType && searchable.includes(query.toLowerCase());
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
          <h1 className="display mt-3 text-5xl font-bold">Traza tu propia ruta.</h1>
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

          <div className="order-1 h-[520px] rounded-3xl bg-[#dce9de] p-6 lg:sticky lg:top-6 lg:order-2">
            <div
              className="relative h-full overflow-hidden rounded-2xl bg-[#cfe2d1]"
              style={{
                backgroundImage: "radial-gradient(#8fb899 1px, transparent 1px)",
                backgroundSize: "18px 18px",
              }}
            >
              <div className="absolute inset-8 rounded-[45%] border-4 border-palm/30" />
              <p className="absolute left-6 top-6 rounded-full bg-white px-4 py-2 text-xs font-bold text-palm shadow">
                Mapa interactivo
              </p>
              {filtered.map((item, index) => (
                <Link
                  key={item.slug}
                  to={`/lugar/${item.slug}`}
                  style={{
                    left: `${15 + (index * 19) % 70}%`,
                    top: `${20 + (index * 31) % 65}%`,
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 text-volcano drop-shadow"
                >
                  <MapPin fill="currentColor" size={34} />
                </Link>
              ))}
            </div>
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
  const initialItem = items.find((item) => item.slug === slug) || items[0] || fallbackData[0];
  const [item, setItem] = useState(initialItem);

  useEffect(() => {
    let ignore = false;

    apiRequest(`/api/content/${slug}`)
      .then((row) => {
        if (!ignore) {
          setItem(row);
        }
      })
      .catch(() => {
        if (!ignore) {
          setItem(initialItem);
        }
      });

    return () => {
      ignore = true;
    };
  }, [initialItem, slug]);

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
            <h2 className="display mt-10 text-3xl font-bold text-royal">
              Vale la pena conocerlo
            </h2>
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
          </aside>
        </div>
      </main>
    </>
  );
}

function Admin() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let ignore = false;

    apiRequest("/api/admin/content", {
      headers: { Authorization: `Bearer ${getAdminToken()}` },
    })
      .then((rows) => {
        if (!ignore) {
          setItems(rows);
          setLoadError("");
        }
      })
      .catch((error) => {
        if (ignore) return;

        if (error.message === "API error 401") {
          clearAdminToken();
          navigate("/admin/login", { replace: true });
          return;
        }

        setLoadError("No fue posible cargar el contenido administrativo.");
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [navigate]);

  const toggleActive = async (item) => {
    const nextActive = !item.active;
    const previousItems = items;

    setItems((current) =>
      current.map((currentItem) =>
        currentItem.slug === item.slug ? { ...currentItem, active: nextActive } : currentItem
      )
    );

    try {
      await apiRequest(`/api/admin/content/${item.slug}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${getAdminToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: nextActive }),
      });
    } catch (error) {
      setItems(previousItems);

      if (error.message === "API error 401") {
        clearAdminToken();
        navigate("/admin/login", { replace: true });
      }
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  };

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
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-sm font-bold uppercase tracking-widest text-volcano">Administración</p>
        <h1 className="display mt-2 text-5xl font-bold text-royal">Contenido</h1>
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex justify-between">
            <input className="rounded-lg border px-4 py-2" placeholder="Buscar contenido..." />
            <button className="rounded-lg bg-royal px-4 py-2 font-bold text-white">
              + Nuevo contenido
            </button>
          </div>

          {isLoading && <p className="border-t py-8 text-center text-slate-500">Cargando contenido...</p>}

          {loadError && (
            <p className="border-t py-8 text-center text-red-700">{loadError}</p>
          )}

          {!isLoading && !loadError && items.length === 0 && (
            <p className="border-t py-8 text-center text-slate-500">No hay contenido registrado.</p>
          )}

          {!isLoading && !loadError && items.map((item) => (
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
        </div>
      </main>
    </div>
  );
}

function getAdminToken() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

function saveAdminToken(token) {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

function clearAdminToken() {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (getAdminToken()) {
      navigate("/admin", { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await apiRequest("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      saveAdminToken(response.access_token);
      navigate("/admin", { replace: true });
    } catch {
      setError("Credenciales inválidas o servicio no disponible.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-royal px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <p className="text-sm font-bold uppercase tracking-widest text-volcano">Administración</p>
        <h1 className="display mt-2 text-4xl font-bold text-royal">Iniciar sesión</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          Acceso privado para gestionar el contenido de la demo turística.
        </p>

        <label className="mt-8 block text-sm font-bold text-slate-700" htmlFor="email">
          Correo
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-royal"
          autoComplete="email"
          required
        />

        <label className="mt-5 block text-sm font-bold text-slate-700" htmlFor="password">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-royal"
          autoComplete="current-password"
          required
        />

        {error && <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-7 w-full rounded-lg bg-royal px-5 py-3 font-bold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}

function ProtectedAdminRoute({ children }) {
  return getAdminToken() ? children : <Navigate to="/admin/login" replace />;
}

function App() {
  const { items } = useContent();

  return (
    <Routes>
      <Route path="/" element={<Home items={items} />} />
      <Route path="/explorar" element={<Explore items={items} />} />
      <Route path="/lugar/:slug" element={<Detail items={items} />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <Admin />
          </ProtectedAdminRoute>
        }
      />
    </Routes>
  );
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
