import { PageHeader } from "@/components/shared/PageHeader";

export default function DashboardHomePage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <PageHeader
        title="Inicio"
        description="Tu centro de productividad — hábitos, tareas, enfoque y más."
      />
    </div>
  );
}
