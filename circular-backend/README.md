# Circular - Backend (Kurzreferenz für das Frontend)

Kurz: Diese Datei erklärt, wie das Backend gestartet wird und wie das Frontend die wichtigsten API‑Funktionen nutzt (Profile, Artikel, Suche/Filter, Nachrichten, Tauschanfragen, Admin‑Aktionen, Notifications).

Wichtig: Runtime-Swagger/OpenAPI wurde aus dem Backend entfernt (siehe `README-SWAGGER.md.deleted` für ein Backup). Diese README ersetzt die Live‑Dokumentation und liefert konkrete Beispiele für das Frontend.

Basis
- Basis‑URL lokal: http://localhost:8080
- API‑Prefix: /api/v1
- Content-Type: application/json

Schnellstart (lokal)
1) Build & Tests:
```bash
cd circular-backend
./gradlew clean build
```
2) App starten:
```bash
./gradlew bootRun
```
3) Tests:
```bash
./gradlew test
# Test-Report: build/reports/tests/test/index.html
```

Datenbank & Profile
- Produktion: Konfiguriere Oracle (siehe `src/main/resources/application.properties`).
- Test: In Tests wird H2 verwendet (Profile: `test`).
- Flyway‑Migrations unter `src/main/resources/db/migration`.

Auth & Admin
- Aktuell gibt es kein vollwertiges AuthN/AuthZ. Für Admin‑Aktionen wird vorläufig der Header `X-ADMIN: true` erwartet (nur für Entwicklung/Tests!).
- In Produktion bitte durch echte Rollen (z. B. Spring Security + JWT/Roles) ersetzen.

API Übersicht (Frontend-Fokus)
- Base: `http://localhost:8080/api/v1`
- Alle Beispiele verwenden `curl` und JSON.

1) Profile (Nutzer)

- Registrierung (neuer Nutzer)
  - POST `/api/v1/profiles`
  - Body (JSON):
    {
      "username": "alice",
      "displayName": "Alice Müller",
      "email": "alice@example.com",
      "password": "geheim123",
      "bio": "Tausche gern Jacken",
      "avatarUrl": "/img/alice.png"
    }
  - Response: 201 Created mit Profil (ohne Passwort). Beispiel:
    {
      "id": 10,
      "username": "alice",
      "displayName": "Alice Müller",
      "email": "alice@example.com",
      "bio": "Tausche gern Jacken",
      "avatarUrl": "/img/alice.png",
      "createdAt": "2025-12-06T..."
    }

- Nutzer abrufen
  - GET `/api/v1/profiles/{id}`
  - Response: 200 OK mit Profil JSON

2) Artikel
- Datenformate: Ein `Article`-Objekt enthält mindestens:
  - `id`, `title` (Name), `summary` (Beschreibung), `images` (Liste oder String), `size`, `condition`, `available` (Boolean), `type` (Kategorie), `author` (Profile id oder name), `article_date`.

- Alle Artikel
  - GET `/api/v1/articles`
  - Response: 200 OK, JSON‑Array

- Artikel‑Detail
  - GET `/api/v1/articles/{id}`
  - Response: 200 OK, detailliertes Article DTO mit `images` (Liste), `description` (text)

- Suche & Filter
  - GET `/api/v1/articles/search`
  - Query‑Parameter:
    - `q` (optional) — Volltextsuchbegriff (sucht in `title` und `summary`)
    - `type` (optional) — Kategorie (z. B. `jacket`, `shirt`)
    - `size` (optional) — Größe
    - `condition` (optional) — Zustand (z. B. `new`, `good`, `used`)
    - `color` (optional) — Farbe
    - `available` (optional) — `true`/`false`
    - `page` (optional), `size` (optional) — Paginierung (falls implementiert)

  - Beispiele:
    ```bash
    # Volltext
    curl -s "http://localhost:8080/api/v1/articles/search?q=jeans"

    # Kategorie + Volltext
    curl -s "http://localhost:8080/api/v1/articles/search?q=blue&type=shirt"

    # Filter nach Kategorie und Zustand
    curl -s "http://localhost:8080/api/v1/articles/search?type=jacket&condition=good&available=true"
    ```

  - Response: JSON Array mit passenden `Article` Objekten.

3) Nachrichten (Messaging)
- Nachricht senden
  - POST `/api/v1/messages`
  - Body:
    {
      "senderId": 1,
      "recipientId": 2,
      "content": "Ist der Artikel noch verfügbar?"
    }
  - Response: 201 Created mit Message DTO (id, senderId, recipientId, content, createdAt)

- Posteingang abrufen
  - GET `/api/v1/messages/inbox/{recipientId}`
  - Response: 200 OK, JSON Array, neueste zuerst (Beispiel in Tests)

4) Tauschanfragen (Trade Requests)
- Tausch anfragen
  - POST `/api/v1/trade-requests`
  - Body Beispiel:
    {
      "requesterId": 1,
      "receiverId": 2,
      "requestedArticleId": 5,
      "offeredArticleIds": [7,8],
      "message": "Hättest du Interesse am Tausch?"
    }
  - Response: 201 Created mit TradeRequest DTO

- Tauschstatus ändern (z. B. accept/reject)
  - PATCH `/api/v1/trade-requests/{id}/status`
  - Body: `{ "status": "accepted" }` oder `{ "status": "rejected" }`
  - Response: 200 OK mit aktualisiertem DTO

- Anfragen nach Nutzer
  - GET `/api/v1/trade-requests/receiver/{id}`
  - GET `/api/v1/trade-requests/requester/{id}`

5) Notifications
- Notifications werden automatisch erstellt für neue Tauschanfragen, Nachrichten etc.
- Benutzer‑Inbox abrufen
  - GET `/api/v1/notifications/{recipientId}`
  - Response: JSON Array mit Notifications (type, message, read, createdAt)

6) Reporting / Moderation
- Inhalte melden
  - POST `/api/v1/reports`
  - Body: `{ "reporterId":1, "objectId": 5, "reason": "inappropriate" }`

- Admin: Bericht/Content löschen (Admin Header erforderlich)
  - DELETE `/api/v1/admin/reports/{id}`
  - Header: `X-ADMIN: true`

7) Admin Nutzer‑Aktionen (Sperren/Löschen)
- Nutzer sperren
  - POST `/api/v1/admin/profiles/{id}/ban`  (Header `X-ADMIN: true`)
- Nutzer löschen
  - DELETE `/api/v1/admin/profiles/{id}` (Header `X-ADMIN: true`)

Fehlerformat
- Standardfehler sind JSON mit mindestens: `timestamp`, `status`, `error`, `message`.
  Beispiel:
  {
    "timestamp": "2025-12-06T...",
    "status": 500,
    "error": "Internal Server Error",
    "message": "..."
  }

Tipps & Hinweise für das Frontend‑Team
- Verwende klare UI‑Flows: Registrierung → Artikel durchsuchen → Detailansicht → Nachricht/Tauschanfrage.
- Admin Aktionen: derzeit nur über `X-ADMIN: true` Header. Niemals in Produktion so belassen.
- Bilder: `images` können als Liste von URLs zurückgegeben werden; Frontend soll prüfen, ob es ein String (CSV) oder Array ist und sicher konvertieren.
- Suche: `q` ist einfache Textsuche; Ergebnisse können unvollständig sein bei sehr komplexen Anforderungen — für Prod Fulltext/ES in Betracht ziehen.

Wie ihr Änderungen oder neue Endpoints verifiziert
1. Build & Start lokal (siehe oben)
2. Endpoints mit `curl` testen (Beispiele in dieser Datei)
3. Falls Fehler wie `NoSuchMethodError` oder 500 auf `/v3/api-docs` auftreten: Hinweis — die Runtime‑Swagger war entfernt; solche Fehler entstehen normalerweise durch inkompatible Bibliotheken. Starte die App neu und prüfe Logs.

Backup der entfernten Swagger‑Dokumentation
- Falls ihr die frühere OpenAPI/Swagger JSON/README braucht: `README-SWAGGER.md.deleted` enthält Hinweise / Backup.

Kontakt & Support
- Wenn ein Endpoint fehlt oder unklare Felder existieren, schlagt ein kleines JSON‑Schema/DTO vor und ich ergänze die Backend‑Antworten.

---
PDF/Automatische OpenAPI: Wenn ihr dringend eine maschinenlesbare OpenAPI wollt, kann ich entweder:
- 1) springdoc temporär re‑enable (nur dev) und eine `openapi.json` erzeugen,
- 2) oder eine manuelle OpenAPI/Markdown‑Exportdatei aus den DTOs erzeugen.
