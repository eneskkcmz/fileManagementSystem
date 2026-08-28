# DEVELOPER.md — Mimari & Gelistirme Rehberi

Bu dokuman **kodun nasil yazildigini** anlatir. Urun kararlari ve "neden" icin ana
spec dokumanina bak; sirayla ne yapilacagi icin `TODO.md`'ye bak.

> **Durum notu:** Bu repo su an bir **dikey dilim** icerir — Factory → Project → WorkItem
> + Activity uctan uca calisir. Diger moduller (Checklist, Feedback, Document, ...) ayni
> kaliba gore eklenecek. Iki bilincli sapma var (asagida "Spec'ten Sapmalar").

---

## 0. Domain / Baglam (Uzman Sistem <-> Borcelik)

Bu araci dogru modellemek icin gercek dunya iliskisi:

- Bu urun **Uzman Sistem**'in (biz — gelistirici/danisman firma) **ic takip araci**dir.
- **Borcelik** (musteri) bize surekli **is ve ister** verir. Bu isler/istekler sistemde
  **WorkItem** (ve ileride Feedback / ChangeRequest) olarak takip edilir.
- **Ekibimiz (assignee'ler):** Mete, Ozan, Yasir, Enes → **Person** entity'si. (Login/rol yok;
  su an sadece isim listesi + ise atama.)
- **Factory** entity'si bu asamada **isin kaynagini = musteri (Borcelik)** temsil eder ve
  su an pratikte **tek kayit** (Borcelik = "is veren birim"). Fabrika-ici detaylar bu
  uygulamada YOK — onlar baska bir uygulamada yonetiliyor. Yani Factory burada bir "cati"
  degil, isin geldigi birim. Ileride cok-musteriye **ozellesebilir** (kavramsal olarak
  Factory ≈ Client/Musteri). Kod tarafinda simdilik isim `Factory` kaliyor — erken yeniden
  adlandirma yok.

Zincir:

```
Borcelik (Factory / isin kaynagi)
   → is / ister  (WorkItem)
       → ekibimizden birine atanir (Person: Mete/Ozan/Yasir/Enes)
       → haftalik planlanir (isoWeek)
       → tamamlanir; geri bildirim / "hatali donus" izlenir
```

Ozet: **Factory = musteri/kaynak, Person = biz (ekip), WorkItem = Borcelik'ten gelen is.**

## 1. Teknoloji

| Katman | Secim | Neden |
|--------|-------|-------|
| Frontend | React + TypeScript (Vite) | Hizli dev, HMR |
| Server state | TanStack Query | Cache + invalidation, global store gereksiz |
| Backend | Node + Express + **TypeScript** | Tek dilde tip guvenligi |
| Persistence | **SQLite (better-sqlite3, WAL)** | Concurrent/atomic write'i kutuphane cozer |
| Validation | Zod (`shared/`'da) | Sema = tip = validation, tek kaynak |

### Spec'ten Sapmalar (onemli — yanlis anlasilmasin)
1. **db.json yerine SQLite.** Spec `db.json` + elle mutex/atomic-rename tarif eder (madde 49-51).
   Bunun yerine SQLite kullanildi: ayni concurrency/atomicity garantisini kutuphane verir,
   `repository` soyutlamasi ayni kaldigi icin ileride Postgres/.NET'e gecis engellenmez.
2. **Backend TypeScript** (spec JS diyor). Frontend ile paylasilan Zod semasi + tek tip
   kaynagi icin. Bu, spec'in "contract guvenli olsun" hedefinin gercek karsiligidir.

Geri kalan her sey spec'e sadik: ID tabanli iliskiler, katmanli mimari, response zarfi,
pagination, activity log, storage soyutlamasi (dosya fazi gelince).

---

## 2. Repo Yapisi (npm workspaces)

```
fileManagementSystem/
├── shared/     @fms/shared — tipler + Zod semalari (TEK KAYNAK)
│   └── src/    common.ts, factory.ts, project.ts, workItem.ts, activity.ts, index.ts
├── server/     @fms/server — Express API
│   └── src/    config, db/, repositories/, services/, controllers/, routes/, middleware/, utils/
└── frontend/   @fms/frontend — React
    └── src/    api/, hooks/, components/, pages/
```

Backend ve frontend, `shared/`'i **kaynak olarak** tuketir (build adimi yok):
- Backend: workspace + `tsx` TS'i dogrudan calistirir.
- Frontend: `vite.config.ts` icindeki alias `@fms/shared → ../shared/src/index.ts`.

---

## 3. Istek Akisi

```
React component
  → hooks/queries.ts (TanStack Query)
    → api/endpoints.ts        (domain cagrilari)
      → api/client.ts         (axios + zarf acma + ApiRequestError)
        → HTTP /api/...
          → routes/*.routes.ts
            → controllers/*.controller.ts   (INCE: parse + service + response)
              → services/*.service.ts       (BUSINESS LOGIC + activity log)
                → repositories/*.repository.ts  (SADECE SQL)
                  → db/connection.ts (SQLite)
```

**Kural: her katman sadece kendi isini yapar.**
- Controller'da business logic YOK. Sadece `parseOrThrow(schema, req.body)` + servisi cagir + `ok(res, ...)`.
- Repository'de business logic YOK. Sadece SQL. Iliski/validation kontrolu service'te.
- Cross-entity kural (or. "proje var mi") service'te; service baska service'i cagirabilir.

---

## 4. Sozlesme Katmani (`shared/`) — en kritik parca

Her entity icin `shared/src/<entity>.ts` sunlari ihrac eder:
- **Domain tipi** (`Factory`, `WorkItem`, ...) — DB satiri ile 1:1.
- **Input Zod semasi** (`factoryInputSchema`, ...) — create/update body'si. Tip: `z.infer<...>`.
- Varsa **enum listeleri** (`workItemStatuses`) ve **TR etiketleri** (`workItemStatusLabelsTr`).

Backend bu semayla dogrular; frontend ayni semadan tip alir ve TR etiketleri gosterir.
**Yeni alan eklerken once burayi degistir** — hem DB hem UI oradan beslenir.

Ortak yapilar `shared/src/common.ts`:
- `ApiResponse<T>` — `{ success, data, message }` / hata zarfi (madde 39).
- `Paginated<T>` — liste yaniti (madde 38).
- `paginationQuerySchema`, `auditFields`.

---

## 5. Konvansiyonlar

- **ID:** `utils/id.ts → generateId('work')` → `work_<uuid>`. Her zaman server uretir, client'tan gelen ID'ye guvenilmez.
- **Zaman:** `nowIso()` ISO string. Tarih alanlari `YYYY-MM-DD` (input semasinda regex).
- **Response:** `utils/response.ts → ok / created / paginate`. Elle `res.json` yazma.
- **Hata:** `utils/AppError.ts` → `AppError.notFound() / badRequest() / conflict()`.
  Firlat, gerisini `middleware/errorHandler.ts` halleder. Controller'da try/catch yok
  (`asyncHandler` sarar).
- **Validation:** `middleware/validate.ts → parseOrThrow(schema, payload)`. Basarisizsa
  400 + field bazli hata doner.
- **Soft-delete:** DELETE fiziksel silmez; `deletedAt` set eder. Repository sorgulari
  `WHERE deletedAt IS NULL` filtreler. (Audit/gecmis kopmasin diye.)
- **Activity log:** Onemli her islemden sonra `activityService.log({...})` cagir
  (create/update/status_changed/delete). Konsola da structured basar (madde 54).

---

## 6. Yeni Entity Ekleme Recetesi

Ornek: **Checklist**. `WorkItem`'i sablon al (`git grep workItem` iyi baslangic).

**A. Sozlesme** — `shared/src/checklistItem.ts`
1. `ChecklistItem` tipi + `checklistItemInputSchema` yaz.
2. `shared/src/index.ts`'e `export * from './checklistItem'` ekle.

**B. DB** — `server/src/db/schema.ts`
3. `CREATE TABLE IF NOT EXISTS checklist_items (...)` ekle (FK: `workItemId`, `deletedAt` kolonu).
4. Ilgili index'i ekle (`idx_checklist_items_workItemId`).

**C. Repository** — `server/src/repositories/checklistItem.repository.ts`
5. `COLS` sabiti + `list/count/getById/insert/update/softDelete`. Factory repo'yu kopyala.

**D. Service** — `server/src/services/checklistItem.service.ts`
6. Business logic. Ornek: bir item tamamlaninca ilgili WorkItem'in progress'ini yeniden hesapla
   (madde 16). Iliski dogrulamasi + `activityService.log(...)` burada.

**E. Controller + Route**
7. `controllers/checklistItem.controller.ts` (ince).
8. `routes/checklistItem.routes.ts` + `routes/index.ts`'e `apiRouter.use('/checklist', ...)`.

**F. Frontend**
9. `api/endpoints.ts`'e `checklistApi` ekle.
10. `hooks/queries.ts`'e `useChecklist` + mutation'lar (mutation sonrasi ilgili
    `queryKey`'leri invalidate et — progress degistigi icin `['work-items']` ve `['projects']` de).
11. Ilgili sayfada UI (or. WorkItem detay ekranina checklist bolumu).

**Bitti kontrolu:** `npm run typecheck --workspaces`. Uc paket de temiz olmali.

---

## 7. Veritabani & Migration

- Su an `schema.ts` "create if not exists" ile idempotent kurar (MVP icin yeterli).
- Model oturunca versiyonlu migration runner'a bu dosya buyutulur; **repository katmani
  degismez**.
- DB dosyasi: `server/data/app.db` (gitignore'da). Silip `npm run seed` ile sifirdan kurabilirsin.

---

## 8. Frontend Notlari

- Component **dogrudan axios cagirmaz** → `api/endpoints.ts` → `hooks/queries.ts` uzerinden.
- Sunucu state = TanStack Query. UI state = `useState`. Global store MVP'de yok.
- Mutation `onSuccess`'te ilgili query'leri invalidate et; stats WorkItem'a bagli oldugu
  icin WorkItem degisiminde `['projects']`'i da invalidate et (`invalidateProjectViews`).
- Form hatalari: `ApiRequestError.errors` (field bazli) → input altinda goster.
- Dev'de `/api` Vite proxy ile `:5050`'ye gider (CORS derdi yok). Prod'da `VITE_API_URL`.

---

## 9. Calistirma

```bash
npm install
npm run seed --workspace=server   # opsiyonel demo veri
npm run dev:server                # :5050  (terminal 1)
npm run dev:frontend              # :5173  (terminal 2)
```

Port 5050 secildi cunku macOS 5000'i AirPlay icin kullanir.
