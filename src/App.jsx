import { useAppController } from "./controllers/useAppController";
import { Header }     from "./views/components/Header";
import { Footer }     from "./views/components/Footer";
import { EditTimer }  from "./views/components/EditTimer";
import { SetsView }   from "./views/SetsView";
import { TimersView } from "./views/TimersView";

export default function App() {
  const ctrl = useAppController();

  return (
    <div className="w-screen min-h-screen bg-mt-bg font-poppins text-mt-white flex flex-col">
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap"
        rel="stylesheet"
      />

      <Header
        view={ctrl.view}
        activeSet={ctrl.activeSet}
        timers={ctrl.timers}
        doneCount={ctrl.doneCount}
        anyRunning={ctrl.anyRunning}
        onBack={ctrl.goToSets}
        onStartAll={ctrl.startAll}
        onPauseAll={ctrl.pauseAll}
        onResetAll={ctrl.resetAll}
      />

      <main className="flex-1 p-7">
        {ctrl.view === "sets" && (
          <SetsView
            sets={ctrl.sets}
            newSetName={ctrl.newSetName}
            editingSet={ctrl.editingSet}
            onNewSetNameChange={ctrl.setNewSetName}
            onAddSet={ctrl.addSet}
            onOpenSet={ctrl.openSet}
            onDeleteSet={ctrl.deleteSet}
            onStartEditSet={(set) => ctrl.setEditingSet({ id: set.id, name: set.name })}
            onRenameSet={ctrl.renameSet}
            onEditingSetChange={ctrl.setEditingSet}
          />
        )}

        {ctrl.view === "timers" && (
          <TimersView
            timers={ctrl.timers}
            running={ctrl.running}
            doneCount={ctrl.doneCount}
            onAddTimer={ctrl.addTimer}
            onToggle={ctrl.toggleTimer}
            onReset={ctrl.resetTimer}
            onEdit={ctrl.setEditTimer}
            onDelete={ctrl.deleteTimer}
          />
        )}
      </main>

      {ctrl.editTimer && (
        <EditTimer
          timer={ctrl.editTimer}
          onSave={ctrl.applyEdit}
          onClose={() => ctrl.setEditTimer(null)}
        />
      )}

      {ctrl.view === "sets" && <Footer />}
    </div>
  );
}
