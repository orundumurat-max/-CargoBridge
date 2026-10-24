import { useMemo, useState } from 'react';
import {
  ArrowDownUp, ArrowRight, BadgeCheck, Bell, Box, Building2, CheckCircle2,
  ChevronDown, CircleHelp, ClipboardList, Globe2, Menu, MessageSquare,
  Plus, Search, ShieldCheck, SlidersHorizontal, Truck, X
} from 'lucide-react';
import type { LoadListing, NewLoadInput, RouteType } from './types';
import { createLoad, getLoads, addOffer, resetDemoData } from './storage';

type Modal = 'new-load' | 'offer' | 'details' | null;

const countries = ['Tümü', 'Türkiye', 'Rusya', 'İran', 'Kazakistan'];
const vehicles = ['Tenteli tır', 'Kapalı kasa', 'Frigorifik', 'Mega dorse', 'Kamyon', 'Lowbed'];
const currencySymbol: Record<string, string> = { TRY: '₺', RUB: '₽', EUR: '€', USD: '$' };

function money(price: number | null, currency: string) {
  return price == null ? 'Teklif bekleniyor' : `${currencySymbol[currency] ?? ''}${price.toLocaleString('tr-TR')}`;
}

function dateLabel(value: string) {
  if (!value) return 'Tarih belirtilmedi';
  return new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(`${value}T12:00:00`));
}

function App() {
  const [loads, setLoads] = useState<LoadListing[]>(getLoads);
  const [searchText, setSearchText] = useState('');
  const [country, setCountry] = useState('Tümü');
  const [route, setRoute] = useState<'all' | RouteType>('all');
  const [vehicle, setVehicle] = useState('Tüm araçlar');
  const [modal, setModal] = useState<Modal>(null);
  const [selected, setSelected] = useState<LoadListing | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState('');
  const [tab, setTab] = useState<'loads' | 'my-loads'>('loads');

  const filteredLoads = useMemo(() => loads.filter(load => {
    if (load.status !== 'open' && tab === 'loads') return false;
    if (tab === 'my-loads' && !load.id.startsWith('CB-')) return false;
    if (country !== 'Tümü' && load.country !== country) return false;
    if (route !== 'all' && load.routeType !== route) return false;
    if (vehicle !== 'Tüm araçlar' && load.vehicleType !== vehicle) return false;
    const query = searchText.trim().toLocaleLowerCase('tr-TR');
    const searchable = `${load.origin} ${load.destination} ${load.cargoType} ${load.companyName} ${load.id}`.toLocaleLowerCase('tr-TR');
    return !query || searchable.includes(query);
  }), [loads, searchText, country, route, vehicle, tab]);

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(''), 3200);
  }

  function handleCreate(input: NewLoadInput) {
    const created = createLoad(input);
    setLoads(getLoads());
    setModal(null);
    setTab('loads');
    setCountry('Tümü');
    setSearchText('');
    notify(`İlanın oluşturuldu: ${created.id}`);
  }

  function handleOffer(loadId: string, companyName: string, price: number, currency: LoadListing['currency'], note: string) {
    setLoads(addOffer(loadId, { companyName, price, currency, note }));
    setModal(null);
    setSelected(null);
    notify('Teklif demo olarak kaydedildi.');
  }

  function showDetails(load: LoadListing) {
    setSelected(load);
    setModal('details');
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="CargoBridge ana sayfa">
          <span className="brand-mark"><Truck size={22} strokeWidth={2.5} /></span>
          <span>Cargo<span>Bridge</span><small>YÜK & NAKLİYE PAZARYERİ</small></span>
        </a>
        <nav className={mobileMenu ? 'nav-links open' : 'nav-links'}>
          <a className="active" href="#loads" onClick={() => setMobileMenu(false)}>Yük ilanları</a>
          <a href="#how" onClick={() => setMobileMenu(false)}>Nasıl çalışır?</a>
          <a href="#trust" onClick={() => setMobileMenu(false)}>Güvenlik</a>
        </nav>
        <div className="top-actions">
          <button className="icon-button" aria-label="Bildirimler" onClick={() => notify('Demo sürümünde bildirimler etkin değil.')}><Bell size={19} /></button>
          <button className="button button-primary header-cta" onClick={() => setModal('new-load')}><Plus size={17} /> Yük ilanı ver</button>
          <button className="icon-button mobile-menu" aria-label="Menüyü aç" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <div className="eyebrow"><span className="pulse" /> DOĞRUDAN TAŞIMACILIK PAZARYERİ</div>
            <h1>Yükünü bul.<br /><span>Aracını doldur.</span></h1>
            <p>Yük sahipleri ve nakliyeciler, aracı komisyonculara ihtiyaç duymadan doğrudan buluşsun.</p>
            <div className="hero-actions">
              <button className="button button-light" onClick={() => document.getElementById('loads')?.scrollIntoView({ behavior: 'smooth' })}><Search size={18} /> Yük ara</button>
              <button className="button button-outline-light" onClick={() => setModal('new-load')}><Plus size={18} /> Ücretsiz ilan oluştur</button>
            </div>
            <div className="hero-trust"><ShieldCheck size={17} /> Şeffaf ilanlar · Doğrudan iletişim · Kontrol sende</div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="route-line route-line-one" />
            <div className="route-line route-line-two" />
            <div className="map-dot dot-one" /><div className="map-dot dot-two" /><div className="map-dot dot-three" />
            <div className="floating-card card-route"><span className="card-icon"><Truck size={18} /></span><div><strong>İstanbul → Ankara</strong><small>Yurt içi yük</small></div><BadgeCheck size={18} className="green" /></div>
            <div className="truck-illustration"><Truck size={145} strokeWidth={1.1} /></div>
            <div className="floating-card card-match"><span className="match-icon"><CheckCircle2 size={20} /></span><div><strong>Doğrudan eşleşme</strong><small>Aracı olmadan iletişim</small></div></div>
          </div>
          <div className="hero-bottom"><span><strong>01</strong> Yükünü yayınla</span><ArrowRight size={16} /><span><strong>02</strong> Teklifleri karşılaştır</span><ArrowRight size={16} /><span><strong>03</strong> Doğrudan anlaş</span></div>
        </section>

        <section className="stats-row" aria-label="Platform özellikleri">
          <div><span className="stat-icon"><Box size={20} /></span><div><strong>Yük ilanları</strong><small>Farklı güzergâhlar</small></div></div>
          <div><span className="stat-icon"><Truck size={20} /></span><div><strong>Uygun araçlar</strong><small>Aracına göre filtrele</small></div></div>
          <div><span className="stat-icon"><Globe2 size={20} /></span><div><strong>Çoklu güzergâh</strong><small>Yurt içi ve uluslararası</small></div></div>
          <div><span className="stat-icon"><ShieldCheck size={20} /></span><div><strong>Şeffaf süreç</strong><small>Teklif ve ilan kaydı</small></div></div>
        </section>

        <section className="loads-section" id="loads">
          <div className="section-heading">
            <div><div className="eyebrow dark-eyebrow">NAKLİYE PAZARYERİ</div><h2>Yük ilanlarını keşfet</h2><p>Güzergâhına ve aracına uygun yükleri bul.</p></div>
            <button className="button button-primary" onClick={() => setModal('new-load')}><Plus size={17} /> Yük ilanı ver</button>
          </div>
          <div className="filter-panel">
            <label className="search-field"><Search size={19} /><input value={searchText} onChange={e => setSearchText(e.target.value)} placeholder="Şehir, yük türü veya ilan no ara..." /><kbd>⌘ K</kbd></label>
            <label className="select-field"><Globe2 size={17} /><select value={country} onChange={e => setCountry(e.target.value)}>{countries.map(c => <option key={c}>{c}</option>)}</select><ChevronDown size={15} /></label>
            <label className="select-field"><Truck size={17} /><select value={vehicle} onChange={e => setVehicle(e.target.value)}>{['Tüm araçlar', ...vehicles].map(v => <option key={v}>{v}</option>)}</select><ChevronDown size={15} /></label>
            <button className="filter-button" onClick={() => { setSearchText(''); setCountry('Tümü'); setVehicle('Tüm araçlar'); setRoute('all'); }}><SlidersHorizontal size={17} /> Sıfırla</button>
          </div>
          <div className="tabs">
            <button className={tab === 'loads' ? 'tab active' : 'tab'} onClick={() => setTab('loads')}>Tüm ilanlar <span>{loads.filter(l => l.status === 'open').length}</span></button>
            <button className={tab === 'my-loads' ? 'tab active' : 'tab'} onClick={() => { setTab('my-loads'); notify('Demo sürümünde kullanıcı hesabı yok; ilanlar tarayıcıda saklanır.'); }}>İlanlarım</button>
            <div className="route-toggle"><button className={route === 'all' ? 'selected' : ''} onClick={() => setRoute('all')}>Tümü</button><button className={route === 'domestic' ? 'selected' : ''} onClick={() => setRoute('domestic')}>Yurt içi</button><button className={route === 'international' ? 'selected' : ''} onClick={() => setRoute('international')}>Uluslararası</button></div>
          </div>

          <div className="load-list">
            {filteredLoads.length === 0 ? <div className="empty-state"><Search size={28} /><h3>Uygun ilan bulunamadı</h3><p>Filtreleri değiştirebilir veya yeni bir ilan oluşturabilirsin.</p><button className="button button-primary" onClick={() => setModal('new-load')}>İlan oluştur</button></div> : filteredLoads.map(load => (
              <article className="load-card" key={load.id}>
                <div className="load-main">
                  <div className="load-type-row"><span className={load.routeType === 'domestic' ? 'tag tag-blue' : 'tag tag-purple'}>{load.routeType === 'domestic' ? 'YURT İÇİ' : 'ULUSLARARASI'}</span><span className="load-id">{load.id}</span>{load.verified && <span className="verified"><BadgeCheck size={13} /> Firma bilgisi doğrulanmış</span>}</div>
                  <div className="route-block">
                    <div className="route-place"><span className="origin-dot" /><div><small>YÜKLEME</small><strong>{load.origin}</strong></div></div>
                    <div className="route-connector"><span /><ArrowDownUp size={14} /></div>
                    <div className="route-place"><span className="destination-dot" /><div><small>TESLİMAT</small><strong>{load.destination}</strong></div></div>
                  </div>
                  <div className="load-meta"><span><Box size={15} />{load.cargoType}</span><span><Truck size={15} />{load.vehicleType}</span><span>{load.weightTons} ton</span><span>{dateLabel(load.loadingDate)}</span></div>
                  <div className="company-line"><Building2 size={15} /><span>{load.companyName}</span><span className="offer-count"><MessageSquare size={14} /> {load.offers.length} teklif</span></div>
                </div>
                <div className="load-side"><div><small>TAŞIMA BEDELİ</small><strong className="price">{money(load.price, load.currency)}</strong></div><button className="button button-primary card-cta" onClick={() => showDetails(load)}>İlanı incele <ArrowRight size={16} /></button><button className="text-button" onClick={() => { setSelected(load); setModal('offer'); }}>Teklif ver</button></div>
              </article>
            ))}
          </div>
          <div className="demo-note"><CircleHelp size={16} /><span><strong>Demo bilgisi:</strong> Bu ekrandaki ilanlar örnek veridir. Oluşturduğun ilanlar yalnızca bu tarayıcıda saklanır; henüz başka kullanıcılara gönderilmez.</span><button onClick={() => { setLoads(resetDemoData()); setSearchText(''); setCountry('Tümü'); notify('Örnek veriler sıfırlandı.'); }}>Örnek verileri sıfırla</button></div>
        </section>

        <section className="how-section" id="how">
          <div className="section-heading centered"><div><div className="eyebrow dark-eyebrow">BASİT VE ŞEFFAF</div><h2>Üç adımda doğrudan eşleşme</h2><p>Yükünü paylaş, teklifleri gör, kararını kendin ver.</p></div></div>
          <div className="steps-grid"><div className="step-card"><span className="step-number">01</span><span className="step-icon"><ClipboardList size={23} /></span><h3>Yükünü yayınla</h3><p>Güzergâhı, yük tipini, araç ihtiyacını ve tarihini gir. İlanını nakliyecilere ulaştır.</p></div><div className="step-card"><span className="step-number">02</span><span className="step-icon"><MessageSquare size={23} /></span><h3>Teklifleri karşılaştır</h3><p>Nakliyecilerden gelen fiyat ve açıklamaları değerlendir. Koşulları doğrudan görüş.</p></div><div className="step-card"><span className="step-number">03</span><span className="step-icon"><CheckCircle2 size={23} /></span><h3>Anlaşmanı netleştir</h3><p>Fiyatı, tarihi ve taşıma şartlarını karşılıklı teyit et. Tarafların sorumluluklarını netleştir.</p></div></div>
        </section>

        <section className="trust-section" id="trust"><div className="trust-copy"><div className="eyebrow">GÜVEN ÖNCE GELİR</div><h2>Doğrudan bağlantı.<br /><span>Daha şeffaf süreç.</span></h2><p>CargoBridge, yük sahibi ile nakliyeciyi buluşturur. Firma doğrulama durumu, ilan geçmişi ve teklif kayıtları daha bilinçli karar vermene yardımcı olur.</p><div className="trust-points"><span><CheckCircle2 size={18} /> Firma doğrulama durumu</span><span><CheckCircle2 size={18} /> İlan ve teklif kayıtları</span><span><CheckCircle2 size={18} /> Şikâyet bildirimi için temel</span></div></div><div className="trust-card"><div className="trust-card-head"><ShieldCheck size={24} /><div><strong>Şeffaflık ilkesi</strong><small>Taraflar doğrudan görüşür</small></div></div><div className="trust-row"><span>İlan bilgileri</span><strong className="status-good">Kayıt altına alınır</strong></div><div className="trust-row"><span>Fiyat anlaşması</span><strong>Taraflar belirler</strong></div><div className="trust-row"><span>Ödeme ve gümrük</span><strong>Tarafların sorumluluğu</strong></div><p className="trust-disclaimer">Doğrulama rozeti bir garanti veya sigorta değildir. Gerçek sürümde doğrulama ve uyuşmazlık süreçleri ayrıca uygulanmalıdır.</p></div></section>
      </main>

      <footer className="footer"><a className="brand footer-brand" href="#"><span className="brand-mark"><Truck size={20} /></span><span>Cargo<span>Bridge</span><small>YÜK & NAKLİYE PAZARYERİ</small></span></a><span>Yük ve nakliyeciyi doğrudan buluşturur.</span><div><a href="#how">Nasıl çalışır?</a><a href="#trust">Güvenlik</a><a href="mailto:info@cargobridge.example">İletişim (demo)</a></div><small>© {new Date().getFullYear()} CargoBridge · Demo sürümü</small></footer>

      {modal === 'new-load' && <NewLoadModal onClose={() => setModal(null)} onSubmit={handleCreate} />}
      {modal === 'offer' && selected && <OfferModal load={selected} onClose={() => setModal(null)} onSubmit={handleOffer} />}
      {modal === 'details' && selected && <DetailsModal load={loads.find(l => l.id === selected.id) ?? selected} onClose={() => setModal(null)} onOffer={() => setModal('offer')} />}
      {toast && <div className="toast" role="status"><CheckCircle2 size={18} />{toast}</div>}
    </div>
  );
}

function ModalFrame({ title, subtitle, onClose, children }: { title: string; subtitle: string; onClose: () => void; children: React.ReactNode }) {
  return <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><section className="modal" role="dialog" aria-modal="true" aria-label={title}><header className="modal-header"><div><h2>{title}</h2><p>{subtitle}</p></div><button className="icon-button" aria-label="Kapat" onClick={onClose}><X size={20} /></button></header>{children}</section></div>;
}

function NewLoadModal({ onClose, onSubmit }: { onClose: () => void; onSubmit: (input: NewLoadInput) => void }) {
  const [routeType, setRouteType] = useState<RouteType>('domestic');
  const [form, setForm] = useState({ origin: '', destination: '', country: 'Türkiye', cargoType: '', weightTons: '20', vehicleType: 'Tenteli tır', loadingDate: '', price: '', currency: 'TRY' as LoadListing['currency'], notes: '', companyName: '' });
  const [error, setError] = useState('');
  const update = (key: keyof typeof form, value: string) => setForm(prev => ({ ...prev, [key]: value }));
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.origin.trim() || !form.destination.trim() || !form.cargoType.trim() || !form.loadingDate || !form.companyName.trim()) {
      setError('Lütfen yıldızlı alanları doldur.'); return;
    }
    const weight = Number(form.weightTons);
    const price = form.price.trim() ? Number(form.price) : null;
    if (!Number.isFinite(weight) || weight <= 0 || (price !== null && (!Number.isFinite(price) || price < 0))) {
      setError('Ağırlık ve fiyat geçerli bir sayı olmalı.'); return;
    }
    onSubmit({ ...form, routeType, weightTons: weight, price, currency: form.currency });
  }
  return <ModalFrame title="Yeni yük ilanı" subtitle="Yük bilgilerini gir. İlan bu demo tarayıcıda saklanır." onClose={onClose}><form className="modal-form" onSubmit={submit}>
    <div className="segmented full"><button type="button" className={routeType === 'domestic' ? 'selected' : ''} onClick={() => { setRouteType('domestic'); update('country', 'Türkiye'); update('currency', 'TRY'); }}>Türkiye içi</button><button type="button" className={routeType === 'international' ? 'selected' : ''} onClick={() => { setRouteType('international'); update('country', 'Rusya'); update('currency', 'EUR'); }}>Türkiye çıkışlı uluslararası</button></div>
    {routeType === 'international' && <label>Varış ülkesi<select value={form.country} onChange={e => update('country', e.target.value)}>{['Rusya', 'İran', 'Kazakistan'].map(c => <option key={c}>{c}</option>)}</select></label>}
    <div className="form-grid"><label>Yükleme yeri *<input value={form.origin} onChange={e => update('origin', e.target.value)} placeholder="Örn. İstanbul" /></label><label>Varış yeri *<input value={form.destination} onChange={e => update('destination', e.target.value)} placeholder={form.country === 'Türkiye' ? 'Örn. Ankara' : `Örn. ${form.country}`} /></label></div>
    <div className="form-grid"><label>Yük türü *<input value={form.cargoType} onChange={e => update('cargoType', e.target.value)} placeholder="Örn. Paletli ürün" /></label><label>Ağırlık (ton) *<input type="number" min="0.1" step="0.1" value={form.weightTons} onChange={e => update('weightTons', e.target.value)} /></label></div>
    <div className="form-grid"><label>Araç tipi<select value={form.vehicleType} onChange={e => update('vehicleType', e.target.value)}>{vehicles.map(v => <option key={v}>{v}</option>)}</select></label><label>Yükleme tarihi *<input type="date" min={new Date().toISOString().slice(0, 10)} value={form.loadingDate} onChange={e => update('loadingDate', e.target.value)} /></label></div>
    <div className="form-grid"><label>İstenen fiyat (boş bırakılabilir)<input type="number" min="0" value={form.price} onChange={e => update('price', e.target.value)} placeholder="Tekliflere açık" /></label><label>Para birimi<select value={form.currency} onChange={e => update('currency', e.target.value as LoadListing['currency'])}>{['TRY', 'EUR', 'USD', 'RUB'].map(c => <option key={c}>{c}</option>)}</select></label></div>
    <label>Firma adı *<input value={form.companyName} onChange={e => update('companyName', e.target.value)} placeholder="Firma veya işletme adı" /></label>
    <label>Ek açıklama<textarea rows={3} value={form.notes} onChange={e => update('notes', e.target.value)} placeholder="Yükleme koşulları, palet bilgisi vb." /></label>
    {error && <p className="form-error">{error}</p>}<div className="form-notice"><ShieldCheck size={16} /><span>İlan oluşturmak firma doğrulaması anlamına gelmez. Gerçek sürümde kimlik ve firma kontrolleri ayrıca yapılacaktır.</span></div>
    <div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose}>Vazgeç</button><button className="button button-primary" type="submit"><Plus size={17} /> İlanı oluştur</button></div>
  </form></ModalFrame>;
}

function OfferModal({ load, onClose, onSubmit }: { load: LoadListing; onClose: () => void; onSubmit: (loadId: string, companyName: string, price: number, currency: LoadListing['currency'], note: string) => void }) {
  const [companyName, setCompanyName] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<LoadListing['currency']>(load.currency);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  return <ModalFrame title="Taşıma teklifi ver" subtitle={`${load.origin} → ${load.destination} · ${load.id}`} onClose={onClose}><form className="modal-form" onSubmit={e => { e.preventDefault(); const amount = Number(price); if (!companyName.trim() || !price || !Number.isFinite(amount) || amount <= 0) { setError('Firma adı ve geçerli bir teklif fiyatı gir.'); return; } onSubmit(load.id, companyName.trim(), amount, currency, note.trim()); }}>
    <label>Firma / nakliyeci adı *<input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Firma adın" /></label><div className="form-grid"><label>Teklif fiyatı *<input type="number" min="1" value={price} onChange={e => setPrice(e.target.value)} placeholder="Tutar" /></label><label>Para birimi<select value={currency} onChange={e => setCurrency(e.target.value as LoadListing['currency'])}>{['TRY', 'EUR', 'USD', 'RUB'].map(c => <option key={c}>{c}</option>)}</select></label></div><label>Mesaj / koşullar<textarea rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Araç, müsaitlik veya teklif koşulları" /></label>{error && <p className="form-error">{error}</p>}<div className="form-notice"><CircleHelp size={16} /><span>Bu teklif yalnızca demo verisidir; gerçek kullanıcıya iletilmez.</span></div><div className="modal-actions"><button type="button" className="button button-secondary" onClick={onClose}>Vazgeç</button><button type="submit" className="button button-primary">Teklifi kaydet <ArrowRight size={16} /></button></div>
  </form></ModalFrame>;
}

function DetailsModal({ load, onClose, onOffer }: { load: LoadListing; onClose: () => void; onOffer: () => void }) {
  return <ModalFrame title="İlan detayları" subtitle={`İlan no: ${load.id}`} onClose={onClose}><div className="details-body"><div className="details-route"><div><small>YÜKLEME</small><strong>{load.origin}</strong></div><ArrowRight size={20} /><div><small>TESLİMAT</small><strong>{load.destination}</strong></div></div><div className="details-price"><div><small>TAŞIMA BEDELİ</small><strong>{money(load.price, load.currency)}</strong></div><span className={load.routeType === 'domestic' ? 'tag tag-blue' : 'tag tag-purple'}>{load.routeType === 'domestic' ? 'Yurt içi' : 'Uluslararası'}</span></div><div className="detail-grid"><div><small>Yük türü</small><strong>{load.cargoType}</strong></div><div><small>Ağırlık</small><strong>{load.weightTons} ton</strong></div><div><small>Araç tipi</small><strong>{load.vehicleType}</strong></div><div><small>Yükleme tarihi</small><strong>{dateLabel(load.loadingDate)}</strong></div><div><small>Firma</small><strong>{load.companyName}</strong></div><div><small>Firma durumu</small><strong>{load.verified ? 'Doğrulanmış demo kaydı' : 'Doğrulama yapılmamış'}</strong></div></div>{load.notes && <div className="detail-notes"><strong>Ek açıklama</strong><p>{load.notes}</p></div>}<div className="offer-summary"><strong>Teklifler ({load.offers.length})</strong>{load.offers.length ? load.offers.map(o => <div className="offer-row" key={o.id}><div><strong>{o.companyName}</strong><small>{o.note || 'Ek açıklama yok'}</small></div><strong>{money(o.price, o.currency)}</strong></div>) : <p>Henüz teklif verilmemiş.</p>}</div><div className="form-notice"><ShieldCheck size={16} /><span>İlan detayları bir taşıma sözleşmesi veya ödeme garantisi değildir. Koşullar taraflarca ayrıca teyit edilmelidir.</span></div><div className="modal-actions"><button className="button button-secondary" onClick={onClose}>Kapat</button><button className="button button-primary" onClick={onOffer}>Teklif ver <ArrowRight size={16} /></button></div></div></ModalFrame>;
}

export default App;
