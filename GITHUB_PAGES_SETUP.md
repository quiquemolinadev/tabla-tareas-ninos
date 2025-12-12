# Configurar GitHub Pages para Actions

## El problema

GitHub Pages necesita estar configurado para recibir deploys de GitHub Actions.

## Solución

### Paso 1: Ve a Settings

1. Tu repositorio en GitHub
2. **Settings** → **Pages**

### Paso 2: Configura como Deploy from Actions

1. En **Source**, elige: **GitHub Actions** (no "Deploy from a branch")
2. Click **Save**

```
Source: GitHub Actions
```

### Paso 3: Haz push

```bash
git add .
git commit -m "Fix: Actualizar workflow de GitHub Actions"
git push origin main
```

El workflow ahora:
1. ✅ Buildea tu app
2. ✅ Carga los archivos a un artifact
3. ✅ Deploya desde Actions a Pages (sin necesidad de rama gh-pages)

## Ventajas

- ✅ Más permisos automáticos
- ✅ Más seguro (no necesita push a gh-pages)
- ✅ Más simple (una sola rama: main)

¿Ya lo configuraste?
