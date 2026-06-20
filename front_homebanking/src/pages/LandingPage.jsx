import { useNavigate } from 'react-router-dom'
import {
  CreditCard, Wallet, PiggyBank, Send, Smartphone, ShieldCheck,
  TrendingUp, Clock, MapPin, ArrowRight, Lock, BadgePercent, Briefcase,
} from 'lucide-react'
import PublicHeader from '../components/layout/PublicHeader.jsx'
import PublicFooter from '../components/layout/PublicFooter.jsx'

// Productos destacados (estilo marketero, referencia: portales de banca peruana).
const PRODUCTOS = [
  { icon: PiggyBank, color: '#0F265C', titulo: 'Cuenta de Ahorros', desc: 'Maneja tu dinero sin costo de mantenimiento y gana intereses todos los días.' },
  { icon: Wallet, color: '#2a4c9b', titulo: 'Cuenta Sueldo', desc: 'Recibe tu sueldo, retira sin comisiones y accede a beneficios exclusivos.' },
  { icon: BadgePercent, color: '#d0a675', titulo: 'Crédito de Consumo', desc: 'El efectivo que necesitas con tasas preferenciales y cuotas a tu medida.' },
  { icon: Briefcase, color: '#d97706', titulo: 'Crédito Microempresa', desc: 'Impulsa tu negocio con financiamiento ágil pensado para emprendedores.' },
  { icon: Send, color: '#10b981', titulo: 'Transferencias', desc: 'Mueve tu dinero entre tus cuentas al instante, las 24 horas del día.' },
  { icon: CreditCard, color: '#0F265C', titulo: 'Tarjeta de Débito', desc: 'Paga y compra en todo el país, en tiendas y por internet, con total seguridad.' },
]

const BENEFICIOS = [
  { icon: Smartphone, titulo: '100% Digital', desc: 'Abre productos y opera desde tu celular, sin ir a una agencia.' },
  { icon: ShieldCheck, titulo: 'Seguro y protegido', desc: 'Tus operaciones viajan cifradas y bajo supervisión de la SBS.' },
  { icon: Clock, titulo: 'Disponible 24/7', desc: 'Consulta saldos, paga cuotas y transfiere a cualquier hora.' },
  { icon: MapPin, titulo: 'Cobertura nacional', desc: 'Presencia en todo el país, inspirados en la fuerza de los Andes.' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="lp-page">
      <PublicHeader />

      {/* ===== HERO ===== */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-text">
            <span className="lp-hero-tag">Banca Digital · Banco Pichincha</span>
            <h1>Tu banco digital, <br />inspirado en los Andes</h1>
            <p>
              Abre tu cuenta, paga tus créditos y transfiere tu dinero en minutos.
              Todo desde tu Banca por Internet, con la seguridad que mereces.
            </p>
            <div className="lp-hero-actions">
              <button className="lp-btn lp-btn-light" onClick={() => navigate('/login')}>
                <Lock size={18} /> Ingresar a mi banca
              </button>
              <a className="lp-btn lp-btn-outline" href="#productos">
                Conoce nuestros productos <ArrowRight size={18} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ACCESOS RÁPIDOS ===== */}
      <section className="lp-quickbar">
        <button className="lp-quick" onClick={() => navigate('/login')}><Wallet size={20} /> Abrir cuenta</button>
        <button className="lp-quick" onClick={() => navigate('/login')}><BadgePercent size={20} /> Solicitar crédito</button>
        <button className="lp-quick" onClick={() => navigate('/login')}><Send size={20} /> Transferir</button>
        <button className="lp-quick" onClick={() => navigate('/login')}><CreditCard size={20} /> Pagar cuota</button>
      </section>

      {/* ===== PRODUCTOS ===== */}
      <section className="lp-section" id="productos">
        <div className="lp-section-head">
          <h2>Productos para ti</h2>
          <p>Soluciones financieras simples y digitales para cada momento de tu vida.</p>
        </div>
        <div className="lp-products">
          {PRODUCTOS.map((p) => {
            const Icon = p.icon
            return (
              <article className="lp-product" key={p.titulo}>
                <span className="lp-product-icon" style={{ background: `${p.color}1a`, color: p.color }}>
                  <Icon size={26} />
                </span>
                <h3>{p.titulo}</h3>
                <p>{p.desc}</p>
                <button className="lp-product-link" onClick={() => navigate('/login')}>
                  Conócelo <ArrowRight size={15} />
                </button>
              </article>
            )
          })}
        </div>
      </section>

      {/* ===== PROMO ===== */}
      <section className="lp-promo">
        <div className="lp-promo-inner">
          <div>
            <span className="lp-promo-tag"><TrendingUp size={15} /> Producto Digital</span>
            <h2>Solicita tu crédito 100% en línea</h2>
            <p>Sin papeleos ni colas. Pide tu crédito de consumo o microempresa desde tu Banca por Internet y recibe una respuesta en evaluación al instante.</p>
          </div>
          <button className="lp-btn lp-btn-light" onClick={() => navigate('/login')}>
            Solicitar ahora <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ===== BENEFICIOS ===== */}
      <section className="lp-section" id="beneficios">
        <div className="lp-section-head">
          <h2>¿Por qué Banco Pichincha?</h2>
          <p>Una banca cercana, segura y hecha para el Perú.</p>
        </div>
        <div className="lp-benefits">
          {BENEFICIOS.map((b) => {
            const Icon = b.icon
            return (
              <div className="lp-benefit" key={b.titulo}>
                <span className="lp-benefit-icon"><Icon size={24} /></span>
                <h3>{b.titulo}</h3>
                <p>{b.desc}</p>
              </div>
            )
          })}
        </div>
      </section>

      <PublicFooter />
    </div>
  )
}
