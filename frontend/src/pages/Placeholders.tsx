import { Placeholder } from '../components/Placeholder';
import { Icon } from '../components/icons';
import type { ReactNode } from 'react';

function Page({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <>
      <div className="page-head">
        <div className="page-title-row">
          <div>
            <h1 className="page-title">{title}</h1>
            <div className="page-sub">{sub}</div>
          </div>
        </div>
      </div>
      {children}
    </>
  );
}

export function BuHaftaPage() {
  return (
    <Page title="Bu Hafta" sub="Borçelik'ten bu hafta gelen işler tek ekranda">
      <Placeholder
        icon={<Icon.week width={30} height={30} />}
        title="Haftalık iş listesi"
        description="Seçilen takvim haftası için Borçelik'ten gelen işler; her satırda istenen saat, iş detayı, tasarım dosyası, durum ve atanan kişi. Önceki haftalara da buradan bakılır."
        features={[
          'Hafta seçici (ISO week, örn. 2026-W35) + önceki haftalar',
          'Her iş: başlık, detay, istenen saat, tasarım dosyası var mı / adı ne',
          'Durum (backlog → geliştirmede → test → onay → bitti) ve atanan kişi',
          'Kişi / kategori filtreleri',
        ]}
        phase="YP3 — Haftalık Görünüm"
      />
    </Page>
  );
}

export function IslerPage() {
  return (
    <Page title="İşler" sub="Tüm işler ve ister'ler — backlog görünümü">
      <Placeholder
        icon={<Icon.list width={30} height={30} />}
        title="İş / ister havuzu"
        description="Borçelik'ten gelen tüm işlerin filtrelenebilir listesi. Excel ile toplu yükleme ve tekil ekleme buradan yapılır. Her iş detay ekranında checklist, açıklama akışı ve dosyalar bulunur."
        features={[
          'Filtre: durum, tip/kategori, öncelik, kişi, hafta, arama',
          'Excel ile haftalık toplu yükleme (fabrika + hafta → işler)',
          'İş detayı: checklist (otomatik ilerleme) + açıklama/yorum modu',
          'İstenen vs harcanan saat takibi',
        ]}
        phase="YP2 / YP4 / YP5"
      />
    </Page>
  );
}

export function KisilerPage() {
  const team = ['Mete', 'Ozan', 'Yasir', 'Enes'];
  return (
    <Page title="Kişiler" sub="Uzman Sistem ekibi — işleri üstlenen kişiler">
      <Placeholder
        icon={<Icon.people width={30} height={30} />}
        title="Ekip ve atama"
        description="Ekip üyeleri ve işlere atanma. Şimdilik login/rol yok — sadece isim listesi ve işe atama. Auth ileride (V2) buraya bağlanır."
        features={[
          `Ekip: ${team.join(', ')}`,
          'Kişiye iş atama (assignee) ve kişi bazlı iş yükü görünümü',
          'Kişi başına haftalık istenen/harcanan saat',
          'Login/rol yok — sadece isim + atama (auth V2)',
        ]}
        phase="YP1 — Kişi + Assignee"
      />
    </Page>
  );
}

export function DokumanlarPage() {
  return (
    <Page title="Dokümanlar" sub="Tasarım dosyaları ve dokümanlar, versiyonlarıyla">
      <Placeholder
        icon={<Icon.docs width={30} height={30} />}
        title="Doküman & dosya yönetimi"
        description="İşlere bağlı tasarım dosyaları ve genel dokümanlar. Yükleme, indirme, önizleme ve versiyon geçmişi. Fiziksel dosyalar local storage'da, meta veriler DB'de tutulur."
        features={[
          'Upload / download / önizleme / silme',
          'Versiyonlama: güncel versiyon + geçmiş (eskiler silinmez)',
          'İş kalemine attachment olarak bağlama',
          'Güvenlik: tip/boyut doğrulama, rastgele dosya adı',
        ]}
        phase="Faz 5 / Faz 6 — Document & Attachment"
      />
    </Page>
  );
}

export function AnalitikPage() {
  return (
    <Page title="Analitik" sub="İş akışını ölçen grafikler ve trendler">
      <div className="grid g2">
        <div className="card">
          <div className="card-head"><span className="card-title">Kategoriye göre iş <span className="muted">— önizleme</span></span></div>
          <div className="chart-skeleton">
            {[60, 90, 45, 75, 55, 100, 40].map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}
          </div>
        </div>
        <div className="card">
          <div className="card-head"><span className="card-title">Haftalık throughput <span className="muted">— önizleme</span></span></div>
          <div className="chart-skeleton">
            {[40, 55, 70, 60, 85, 75, 95].map((h, i) => <span key={i} style={{ height: `${h}%` }} />)}
          </div>
        </div>
      </div>
      <div className="mt20">
        <Placeholder
          icon={<Icon.chart width={30} height={30} />}
          title="Chart'lı dashboard"
          description="Hangi kategoriden daha çok iş geliyor, neleri yaptıktan sonra hatalı dönüş alıyoruz, haftalık tempo ve saat tahmini ne kadar tutuyor — hepsi grafiklerle."
          features={[
            'Kategori / duruma göre dağılım',
            'Hatalı dönüş oranı (tamamlanmış işlere gelen bug/geri dönüş)',
            'Haftalık throughput ve overdue trendi',
            'İstenen vs harcanan saat karşılaştırması',
          ]}
          phase="YP6 — Analitik & Chart"
        />
      </div>
    </Page>
  );
}
