# TODO.md — Proje Yol Haritasi (adim adim)

Bir maddeye baslamadan once `DEVELOPER.md` bolum 6'daki "Yeni Entity Ekleme Recetesi"ni oku.
Her `[ ]` bir PR/commit buyuklugunde tutulmali. Bir modul bitince `typecheck` temiz olmali.

**Isaretler:** `[x]` bitti · `[~]` kismen · `[ ]` yapilacak

---

## Faz 0 — Altyapi  `[x]`
- [x] Monorepo (npm workspaces): shared / server / frontend
- [x] Shared sozlesme katmani (tip + Zod)
- [x] SQLite baglantisi + WAL + FK + idempotent schema
- [x] Katmanli backend iskeleti (route/controller/service/repository/middleware/utils)
- [x] Response zarfi, merkezi hata yonetimi, pagination, soft-delete, activity log
- [x] Frontend iskeleti (Vite, Router, TanStack Query, api katmani, ortak UI)
- [x] Demo seed

## Faz 1 — Factory / Project / WorkItem (dikey dilim)  `[x]`
- [x] Factory CRUD + liste + detay
- [x] Project CRUD + factory bazli liste + durum
- [x] WorkItem CRUD + filtre (projectId/status/type/priority/search) + status PATCH
- [x] Project dashboard rollup'lari (completed/inProgress/testing/waitingApproval/overdue/overallProgress)
- [x] Dashboard, Fabrikalar, Fabrika detay, Proje detay (Ozet/Is Kalemleri/Aktivite) ekranlari

---

## Faz 2 — Checklist  `[ ]`  (spec madde 16-17)
- [ ] `shared`: `ChecklistItem` tipi + input semasi (`workItemId`, `title`, `isCompleted`, `order`)
- [ ] DB: `checklist_items` tablosu + index
- [ ] Repository + Service + Controller + Route (`/api/work-items/:id/checklist`, `/api/checklist/:id`)
- [ ] **Otomatik progress:** checklist degisince WorkItem.progress = tamamlanan/toplam*100
- [ ] Progress kurali netlik: checklist bos → manuel progress; status completed → 100
- [ ] Frontend: WorkItem detay ekraninda checklist bolumu (ekle/tikla/sil)
- [ ] WorkItem mutation'lari `['work-items']` + `['projects']` invalidate etsin

## Faz 3 — Feedback  `[ ]`  (spec madde 18-19)
- [ ] `shared`: `Feedback` tipi + input (`workItemId`, `description`, `status`)
- [ ] Status akisi: open → in_progress → resolved → closed → rejected
- [ ] DB + Repository + Service (+ activity: feedback_created/resolved) + Controller + Route
- [ ] Frontend: WorkItem detayinda feedback listesi + durum degistirme

## Faz 4 — WorkItem Detay Ekrani  `[ ]`
- [ ] Tam detay sayfasi: aciklama + checklist + feedback + (sonra) attachment + activity
- [ ] Route `/work-items/:id` (su an is kalemleri tabloda inline; ayri ekran gerekli)

## Faz 5 — Document + Versiyonlama  `[ ]`  (spec madde 20-25, 47)
- [ ] `shared`: `Document`, `DocumentVersion` tipleri
- [ ] **Storage abstraction:** `IFileStorage` arayuzu + `LocalFileStorage` (server/src/storage/)
- [ ] Upload akisi: multer/multipart → validation (size/mime/ext/sanitize) → UUID dosya adi → fiziksel kaydet → metadata db
- [ ] Endpoint'ler: upload / download / versions / new version / delete (madde 36)
- [ ] Guvenlik: path traversal koruma (path.resolve ile koke hapset), hash ile dedup
- [ ] Eski versiyonlar silinmez; `currentVersionId` guncel olani gosterir
- [ ] Frontend: Document explorer (liste/upload/download/version history)

## Faz 6 — Attachment  `[ ]`  (spec madde 22)
- [ ] Polymorphic attachment (`entityType`/`entityId`) — WorkItem & Feedback'e dosya
- [ ] Ayni LocalFileStorage'i kullan; storage/attachments/<entityId>/ altinda

## Faz 7 — Change Request  `[ ]`  (spec madde 30)
- [ ] `shared` + DB + katmanlar; status: requested→under_review→approved→rejected→implemented
- [ ] Frontend: proje detayinda "Talepler" sekmesi

## Faz 8 — Activity Genisletme  `[ ]`  (spec madde 27)
- [ ] Yeni modullerin event'lerini activity'e bagla (checklist_completed, document_uploaded, ...)
- [ ] Aktivite ekraninda filtre (entityType/action/tarih)

## Faz 9 — Dashboard Cila  `[ ]`  (spec madde 28, 43)
- [ ] Open feedback sayaci, overdue vurgusu, recent activity zenginlestirme
- [ ] (Opsiyonel) weighted progress (madde 29)

---

## Jira-benzeri Genisleme (yeni kapsam)  `[ ]`

Kararlar: **haftalik planlama = sabit takvim haftasi (ISO week, or. 2026-W35)** ·
**kisi/assignee simdi gelir (auth YOK, sadece isim listesi + atama)**.
Bagimlilik: YP1 → YP2 → (YP3, YP4, YP5) → YP6.

**Onerilen gercek calisma sirasi** (senaryonun omurgasi generic Faz 2-9'dan once gelmeli):
YP1 (kisi) → YP2 (alanlar) → YP3 (haftalik gorunum) → YP4 (Excel) → YP5 (aciklama) →
Faz 2 (Checklist) → Faz 3 (Feedback — "hatali donus" verisi icin sart) → YP6 (chartlar) →
Faz 5/6 (Document/Attachment — tasarim dosyalarinin gercek upload'u).

Baglam: **Borcelik tek kayit (is veren birim)** — bkz. DEVELOPER.md bolum 0. Yani "hangi
fabrika" ekseni pratikte sabit; haftalik gorunumun asil eksenleri **hafta + assignee +
(opsiyonel proje/kategori)**.

Acik tasarim notu: WorkItem su an zorunlu `projectId` tasir. Ama Borcelik'ten gelen
haftalik Excel duz bir liste olabilir (projesiz). Karar: ya `projectId`'yi **opsiyonel**
yap (is dogrudan musteri+hafta+assignee'ye baglanir), ya da "Genel/Haftalik Isler" gibi
bir varsayilan proje kullan. Import'a baslamadan netlestir (model'i bozmadan).

### YP1 — Kisi (Person) + Assignee  `[ ]`
Baglam: Person = **bizim ekip (Uzman Sistem)** — bkz. DEVELOPER.md bolum 0.
- [ ] `shared`: `Person` tipi (id, name, opsiyonel email/etiket) + input semasi
- [ ] DB: `people` tablosu + soft-delete
- [ ] Repository + Service + Controller + Route (`/api/people` CRUD)
- [ ] Seed: **Mete, Ozan, Yasir, Enes**
- [ ] `WorkItem`'a `assigneeId` (nullable, → Person) ekle + grid/detayda goster/ata
- [ ] NOT: login/rol yok; sadece isim listesi. Auth V2'de gelince buraya baglanir.

### YP2 — WorkItem alan genisletme  `[ ]`
- [ ] `WorkItem`'a: `estimatedHours` (istenen saat), ops. `spentHours`,
      `isoWeek` (or. "2026-W35"), `designFileName` (tasarim dosyasi adi — metin)
- [ ] Kategori: mevcut `type` alanini kategori olarak kullan ya da ayri `category` ekle (karar ver)
- [ ] Shared sema + mapper + grid kolonlari + form alanlari guncelle

### YP3 — Haftalik Gorunum  `[ ]`
- [ ] Filtre: `GET /api/work-items?isoWeek=2026-W35&assigneeId=..` (musteri sabit=Borcelik)
- [ ] Frontend: "Bu Hafta" ekrani — hafta sec (+ ops. kisi/kategori filtresi) → is listesi
      (baslik, detay, istenen saat, tasarim dosyasi var mi/adi, durum, assignee)
- [ ] **Onceki haftalar:** hafta seciciyle gecmis haftalara bakma (isoWeek gruplama bedava gelir)

### YP4 — Excel Import (haftalik is yukleme)  `[ ]`
- [ ] Upload endpoint: fabrika + isoWeek + dosya (multipart)
- [ ] Parse: satir → WorkItem (baslik, detay, tip/kategori, estimatedHours, designFileName, assignee-adi)
- [ ] Validation (size/mime/ext/sanitize) + hatali satir raporu
- [ ] Assignee adini Person'a eslestir (yoksa olustur ya da uyar)
- [ ] Frontend: yukleme ekrani + onizleme + sonuc/ozet

### YP5 — Comment / Aciklama Modu  `[ ]`
- [ ] `shared`: `Comment` tipi (id, workItemId, body, opsiyonel authorPersonId, createdAt)
- [ ] DB + Repository + Service (+ activity) + Route (`/api/work-items/:id/comments`)
- [ ] Frontend: WorkItem detayinda yorum/aciklama akisi (gelistirme notlari)

### YP6 — Analitik & Chart'li Dashboard  `[ ]`
- [ ] Analitik endpoint'leri (gruplu aggregate):
  - [ ] Kategoriye gore is dagilimi (hangi kisimdan cok is geliyor)
  - [ ] Duruma gore dagilim + haftalik throughput (hafta basina tamamlanan)
  - [ ] **Hatali donus orani:** tamamlanmis WorkItem'lara gelen bug/reopened feedback (kategori bazli)
  - [ ] Istenen vs harcanan saat (estimatedHours vs spentHours), hafta bazli
  - [ ] Overdue trend
- [ ] Frontend: chart kutuphanesi (or. Recharts) + dashboard'a grafikler
- [ ] NOT: "hatali donus" icin Feedback'te tip (bug) ve/veya `reopened` durumu gerekebilir — YP5/Feedback ile hizala

## Kalite / Teknik Borc  `[ ]`
- [ ] Backend testleri (vitest) — en az service + repository seviyesinde
- [ ] Versiyonlu migration runner (schema.ts buyuyunce)
- [ ] Seed'i idempotent yap (tekrar calisinca cogaltmasin)
- [ ] Basit backup (data/backups/ — spec madde 51)
- [ ] `.env` dogrulamasi (eksik/yanlis deger erken hata)
- [ ] Liste sayfalarinda gercek pagination UI (backend hazir, UI su an pageSize=200 cekiyor)
- [ ] Loglama: structured formatin dosyaya/merkezi yapiya tasinabilir hale getirilmesi

## V2 (sonraki surum)  `[ ]`  (spec madde 62)
- [ ] Authentication + Users + Roles + Permissions
- [ ] Notifications, tags, favorites, gelismis arama, document expiration, share links

## V3 (kurumsal)  `[ ]`  (spec madde 63-65)
- [ ] .NET backend'e gecis — `VITE_API_URL` disinda frontend degismemeli, contract korunmali
- [ ] Gercek DB (PostgreSQL/SQL Server), cloud storage (S3/Azure), Redis, background jobs
- [ ] SSO/LDAP/2FA, multi-tenancy, gelismis audit

---

### Onemli hatirlatmalar (devralan icin)
- **db.json degil SQLite** kullaniliyor; **backend TypeScript** (spec'ten bilincli sapma — DEVELOPER.md bolum 1).
- Yeni entity = DEVELOPER.md bolum 6 recetesi. Sablon: Factory (basit) / WorkItem (filtre+status ornegi).
