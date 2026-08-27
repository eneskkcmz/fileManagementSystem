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
