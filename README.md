# CargoBridge MVP — Yük ve Nakliye Pazaryeri

Türkiye içi ve Türkiye çıkışlı uluslararası yük ilanlarını denemek için hazırlanmış **arayüz prototipi**.

## Bu sürümde çalışanlar
- Mobil uyumlu yük ilanı listesi
- Ülke, taşıma türü, araç ve metin filtresi
- Yük ilanı oluşturma formu
- İlan detayları
- Demo teklif verme akışı
- Tarayıcı `localStorage` üzerinde demo kayıtlarını saklama
- Türkiye içi ve Türkiye çıkışlı uluslararası ilan türleri
- Responsive masaüstü ve telefon tasarımı

## Henüz gerçek olmayanlar
Bu sürüm **yayına hazır, çok kullanıcılı bir lojistik sistemi değildir**:
- Giriş/kayıt ve kimlik doğrulama yok.
- İlanlar başka kullanıcılarla paylaşılmaz; yalnızca aynı tarayıcıda saklanır.
- Teklifler gerçek yük sahibine gönderilmez.
- Mesajlaşma, canlı konum, dosya yükleme, ödeme ve bildirimler yoktur.
- Firma doğrulaması yapılmaz. Ekrandaki örnek rozetler demo verisidir.
- Hukuki sözleşme, sigorta veya ödeme garantisi sunulmaz.

## Gereksinimler
- Node.js 20.19+ (önerilir)
- npm
- Git

## Yerel çalıştırma
Terminalde proje klasöründe:

```bash
npm install
npm run dev
```

Vite terminalde yerel adres gösterecektir (çoğunlukla `http://localhost:5173`).

Üretim derlemesi kontrolü:

```bash
npm run build
npm run preview
```

## GitHub'a yükleme

GitHub üzerinde `cargobridge-mvp` adında boş bir repository oluşturduktan sonra:

```bash
git init
git add .
git commit -m "Initial CargoBridge MVP"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADIN/cargobridge-mvp.git
git push -u origin main
```

`KULLANICI_ADIN` yerine kendi GitHub kullanıcı adını yaz.

## Ücretsiz web yayınlama

Bu Vite uygulaması statik web uygulamasıdır. GitHub deposuna kodu göndermek tek başına yayına çıkarmaz. Vercel veya Netlify gibi hizmetlerde GitHub repository bağlanıp build komutu `npm run build`, çıktı klasörü `dist` olarak tanımlanabilir. Ücretsiz planların limitleri ve koşulları hizmet sağlayıcıya göre değişebilir. Gerçek ticari hizmete geçmeden önce ilgili sağlayıcının güncel koşullarını kontrol et.

## Sonraki mimari aşama
Gerçek kullanıcılarla çalışmak için backend gereklidir. Önerilen yol:
1. Supabase Auth ile kayıt ve oturum.
2. Postgres tabloları ve Row Level Security (RLS).
3. Firma/taşıyıcı/araç profilleri ve doğrulama durumu.
4. Yük ilanları, teklifler ve tarafların onayladığı taşıma şartları.
5. Supabase Storage ile erişim kontrollü belgeler.
6. Mesajlaşma ve bildirimler.
7. İptal/şikâyet/audit kayıtları.
8. Hukuki ve ülkeye özgü gereklilikler incelendikten sonra gerçek yayına geçiş.

## Güvenlik
- `.env` dosyalarını Git'e gönderme.
- Supabase `service_role` anahtarını istemci uygulamasına asla koyma.
- Tarayıcıdaki `localStorage` verileri güvenilir kanıt veya güvenli veri tabanı değildir.
- Kullanıcı doğrulaması, yetkilendirme, dosya erişimi ve RLS test edilmeden gerçek kullanıcı bilgileri kullanma.
