export default function Custom404() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="p-8 text-center">
        <h1 className="text-4xl font-bold">404 - Página no encontrada</h1>
        <p className="mt-4 text-muted-foreground">Ups, esa página no existe.</p>
      </div>
    </div>
  );
}
