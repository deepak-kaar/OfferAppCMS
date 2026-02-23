# Offer-App — Project Structure

Nx monorepo with Angular frontends, NestJS API, and shared libraries.

---

## Root

```
Offer-App/
├── .editorconfig
├── .env.development
├── .gitignore
├── .hintrc
├── .prettierignore
├── .prettierrc
├── .vscode/
│   ├── extensions.json
│   └── launch.json
├── apps/
├── libs/
├── nx.json
├── package.json
├── package-lock.json
├── README.md
├── test.json
├── tsconfig.base.json
└── Vendor-API.postman_collection.json
```

- **nx.json** — Nx workspace config (targets, cache, dependency constraints: `scope:admin`, `scope:vendor`, `scope:user`).
- **tsconfig.base.json** — Base TypeScript config; path aliases: `@offer-app/shared`, `@offer-app/components`.
- **package.json** — Workspace deps: Angular 21, NestJS 11, PrimeNG, Tailwind, Firebase Admin, etc.

---

## Apps (`apps/`)

### api (NestJS backend)

```
apps/api/
├── .env
├── .swcrc
├── project.json
├── tsconfig.app.json
├── tsconfig.json
└── src/
    ├── main.ts
    ├── app/
    │   ├── app.controller.ts
    │   ├── app.module.ts
    │   ├── app.service.ts
    │   ├── admin/
    │   │   ├── admin.module.ts
    │   │   └── controllers/
    │   │       └── admin.controller.ts
    │   └── vendor/
    │       ├── vendor.module.ts
    │       ├── controller/
    │       │   └── vendor.controller.ts
    │       ├── dto/
    │       │   └── vendor.dto.ts
    │       └── services/
    │           └── vendor.service.ts
    ├── assets/
    │   └── .gitkeep
    └── shared/
        ├── config/
        │   └── config.ts
        ├── interface/
        │   ├── config.ts
        │   └── vendor.ts
        └── modules/
            └── firebase.module.ts
```

- **admin** — Admin module and controller.
- **vendor** — Vendor module with controller, DTOs, and service.
- **shared** — API-level config, interfaces, and shared modules (e.g. Firebase).

---

### admin-web (Angular)

```
apps/admin-web/
├── .postcssrc.json
├── project.json
├── proxy.conf.json
├── public/
│   └── favicon.ico
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.scss
│   ├── tailwind.css
│   └── app/
│       ├── app.config.ts
│       ├── app.html
│       ├── app.routes.ts
│       ├── app.scss
│       ├── app.ts
│       └── test.ts
├── tsconfig.app.json
└── tsconfig.json
```

- Uses Tailwind + PostCSS; has proxy config for API.

---

### user-web (Angular)

```
apps/user-web/
├── project.json
├── public/
│   └── favicon.ico
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.scss
│   └── app/
│       ├── app.config.ts
│       ├── app.html
│       ├── app.routes.ts
│       ├── app.scss
│       └── app.ts
├── tsconfig.app.json
└── tsconfig.json
```

---

### vendor-web (Angular)

```
apps/vendor-web/
├── project.json
├── public/
│   └── favicon.ico
├── src/
│   ├── index.html
│   ├── main.ts
│   ├── styles.scss
│   └── app/
│       ├── app.config.ts
│       ├── app.html
│       ├── app.routes.ts
│       ├── app.scss
│       └── app.ts
├── tsconfig.app.json
└── tsconfig.json
```

---

## Libs (`libs/`)

### shared

```
libs/shared/
├── package.json
├── project.json
├── README.md
├── tsconfig.json
├── tsconfig.lib.json
└── src/
    ├── index.ts
    └── lib/
        ├── core/
        │   └── prime.import.ts
        └── interface/
            └── interface.ts
```

- Import path: `@offer-app/shared`.
- Shared interfaces and PrimeNG-related core (e.g. `prime.import.ts`).

---

### components

```
libs/components/
├── project.json
├── README.md
├── tsconfig.json
├── tsconfig.lib.json
└── src/
    ├── index.ts
    └── lib/
        └── ui/
            ├── ui.css
            ├── ui.html
            └── ui.ts
```

- Import path: `@offer-app/components`.
- Reusable UI components.

---

## Summary

| Item        | Purpose                                      |
|------------|-----------------------------------------------|
| **api**    | NestJS backend (admin + vendor, Firebase)     |
| **admin-web** | Angular app for admins (Tailwind)         |
| **user-web**  | Angular app for end users                 |
| **vendor-web** | Angular app for vendors                  |
| **libs/shared** | Shared types, interfaces, PrimeNG setup  |
| **libs/components** | Shared UI components                  |

Run apps with Nx, e.g. `npx nx serve admin-web`, `npx nx serve api`.
