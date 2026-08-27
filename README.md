# Fabrika Proje & Dokuman Yonetim Sistemi

Fabrikalarin projelerini, is kalemlerini, ilerlemelerini ve (ilerleyen fazlarda)
dokumanlarini merkezi olarak takip eden, tamamen local calisan bir MVP.

## Mimari

```
React + TypeScript (Vite)  →  Node + Express (TypeScript)  →  SQLite (better-sqlite3)
        frontend/                      server/                    server/data/app.db
                         paylasilan sozlesme: shared/ (tip + Zod sema)
```

- **shared/** — Tum entity tipleri ve Zod validation semalari. Backend dogrulamasi,
  backend tipleri ve frontend tipleri tek kaynaktan gelir.
- **server/** — Katmanli API: `routes → controllers → services → repositories → SQLite`.
  Standart response zarfi, merkezi hata yonetimi, pagination, soft-delete, activity log.
- **frontend/** — Feature bazli React. Sunucu state'i TanStack Query ile yonetilir;
  componentler dogrudan HTTP cagrisi yapmaz (`src/api` katmani uzerinden gider).

> Not: MVP `db.json` yerine **SQLite** kullanir — concurrent write / atomic write / backup
> derdini kutuphane cozer, repository soyutlamasi ayni kaldigi icin ileride Postgres/.NET
> API'ye gecis engellenmez. Entity iliskileri ID uzerinden kurulur (gomulu degil).

## Calistirma

```bash
npm install

# 1) (opsiyonel) demo veri
npm run seed --workspace=server

# 2) backend  →  http://localhost:5050/api
npm run dev:server

# 3) frontend →  http://localhost:5173
npm run dev:frontend
```

`server/.env` (ornegi `.env.example`):

```
PORT=5050
DB_PATH=./data/app.db
STORAGE_PATH=./storage
CORS_ORIGIN=http://localhost:5173
```

## Bu surumde olanlar (dikey dilim)

Factory → Project → WorkItem uctan uca: liste + CRUD + is kalemi durum degisimi,
proje dashboard rollup'lari (tamamlanan / devam / testte / onay / gecikmis / genel ilerleme),
ve tum onemli islemler icin activity log. Dashboard, Fabrikalar, Proje detay ekranlari.

## Sonraki fazlar

Checklist (otomatik progress), Feedback, Document + versiyonlama, Attachment,
File storage (LocalFileStorage soyutlamasi), Change Request. Ardindan V2: auth/rol,
bildirim; V3: .NET backend / gercek DB / cloud storage. Sozlesme (`shared/`) korunarak.

## API ozeti

```
GET/POST/PUT/DELETE  /api/factories[/:id]
GET                  /api/factories/:factoryId/projects
GET/POST/PUT/DELETE  /api/projects[/:id]        (GET :id → stats ile)
GET                  /api/projects/:id/activities
GET/POST/PUT/DELETE  /api/work-items[/:id]      (filtre: projectId,status,type,priority,search)
PATCH                /api/work-items/:id/status
GET                  /api/activities
```
