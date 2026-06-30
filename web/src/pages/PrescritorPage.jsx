import { useEffect, useState } from "react";
import { Plus, Save, Trash2 } from "lucide-react";
import { api } from "../api/client";

export default function PrescritorPage() {
  const [pacientes, setPacientes] = useState([]);
  const [exerciciosBase, setExerciciosBase] = useState([]);
  const [selectedPaciente, setSelectedPaciente] = useState("");
  const [plano, setPlano] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      const [pacientesResponse, exerciciosResponse] = await Promise.all([
        api.get("/pacientes"),
        api.get("/exercicios"),
      ]);

      setPacientes(pacientesResponse.data);
      setExerciciosBase(exerciciosResponse.data);
    }

    carregarDados().catch(() => {
      setPacientes([]);
      setExerciciosBase([]);
    });
  }, []);

  const addExercicio = () => {
    setPlano((current) => [...current, { exercicioId: "", series: 3, repeticoes: 10, tempoExecucao: 0 }]);
  };

  const removeExercicio = (index) => {
    setPlano((current) => current.filter((_, itemIndex) => itemIndex !== index));
  };

  const updateExercicio = (index, field, value) => {
    setPlano((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item))
    );
  };

  async function handleSalvar() {
    if (!selectedPaciente || plano.length === 0) return alert("Selecione um paciente e adicione exercicios.");

    setLoading(true);
    try {
      await api.post(`/api/pacientes/${selectedPaciente}/plano-reabilitacao`, {
        fisioterapeutaId: 1,
        exercicios: plano,
      });
      alert("Plano salvo com sucesso!");
      setPlano([]);
    } catch {
      alert("Erro ao salvar plano.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-8">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink">Prescritor Digital</h1>
          <p className="text-slate-500">Monte o plano de reabilitacao personalizado.</p>
        </div>
        <button
          onClick={handleSalvar}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded bg-mint px-6 py-2 font-bold text-ink"
        >
          <Save size={20} />
          {loading ? "Salvando..." : "Salvar Plano"}
        </button>
      </header>

      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium">Paciente</label>
          <select
            className="w-full rounded border p-2"
            value={selectedPaciente}
            onChange={(e) => setSelectedPaciente(e.target.value)}
          >
            <option value="">Selecione um paciente...</option>
            {pacientes.map((paciente) => (
              <option key={paciente.id} value={paciente.id}>
                {paciente.nome}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {plano.map((item, index) => (
            <div key={index} className="flex items-end gap-4 rounded border border-slate-200 bg-slate-50 p-4">
              <div className="flex-1">
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Exercicio</label>
                <select
                  className="w-full rounded border p-2"
                  value={item.exercicioId}
                  onChange={(e) => updateExercicio(index, "exercicioId", e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {exerciciosBase.map((exercicio) => (
                    <option key={exercicio.id} value={exercicio.id}>
                      {exercicio.nome}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-20">
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Series</label>
                <input
                  type="number"
                  className="w-full rounded border p-2"
                  value={item.series}
                  onChange={(e) => updateExercicio(index, "series", e.target.value)}
                />
              </div>
              <div className="w-20">
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Reps</label>
                <input
                  type="number"
                  className="w-full rounded border p-2"
                  value={item.repeticoes}
                  onChange={(e) => updateExercicio(index, "repeticoes", e.target.value)}
                />
              </div>
              <div className="w-24">
                <label className="mb-1 block text-xs font-bold uppercase text-slate-500">Tempo (s)</label>
                <input
                  type="number"
                  className="w-full rounded border p-2"
                  value={item.tempoExecucao}
                  onChange={(e) => updateExercicio(index, "tempoExecucao", e.target.value)}
                />
              </div>
              <button onClick={() => removeExercicio(index)} className="rounded p-2 text-red-500 hover:bg-red-50">
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <button onClick={addExercicio} className="mt-6 inline-flex items-center gap-2 font-semibold text-sky hover:underline">
          <Plus size={20} />
          Adicionar exercicio
        </button>
      </section>
    </div>
  );
}
