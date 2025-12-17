export default function BacktraceLearning() {
  return (
    <div className="space-y-6 text-left text-zinc-800 dark:text-zinc-200">
      <div className="space-y-2">
        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Backtrace Learning Graph
        </p>
        <p>
          An interactive learning graph that helps you visualize and track
          knowledge dependencies. Create nodes for questions and resources,
          connect them to show relationships, and track your understanding
          progress.
        </p>
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Features
        </h3>
        <div className="space-y-2">
          <div className="space-y-1">
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              Node Types
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>
                <span className="font-semibold">Question Nodes</span> (pink) –
                Represent learning questions or concepts
                <ul className="list-disc space-y-1 pl-5">
                  <li>Track understanding level (0-100%)</li>
                  <li>Add optional notes and topic tags</li>
                  <li>
                    Click on understanding level to edit with a slider
                  </li>
                </ul>
              </li>
              <li>
                <span className="font-semibold">Resource Nodes</span> (blue) –
                Represent learning materials
                <ul className="list-disc space-y-1 pl-5">
                  <li>
                    Support various resource types: video, PDF, book, article,
                    website, other
                  </li>
                  <li>Include direct links to resources</li>
                  <li>Add topic tags for organization</li>
                </ul>
              </li>
            </ul>
          </div>

          <div className="space-y-1">
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              Interactive Features
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Visual graph interface with drag-and-drop node layout</li>
              <li>Auto-save positions to Firebase</li>
              <li>Smart connections between resources and questions</li>
              <li>Keyboard shortcuts for deleting selected nodes</li>
              <li>Real-time sync with Firebase across sessions</li>
            </ul>
          </div>

          <div className="space-y-1">
            <p className="font-medium text-zinc-900 dark:text-zinc-100">
              Node Management
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Create new nodes with dedicated forms</li>
              <li>Connect nodes via buttons or by dragging</li>
              <li>Delete nodes and their connected edges</li>
              <li>Update understanding levels with an interactive slider</li>
              <li>Highlight selected nodes visually</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Tech Stack
        </h3>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <span className="font-semibold">Frontend:</span> Next.js 15 with
            React 18
          </li>
          <li>
            <span className="font-semibold">UI:</span> ReactFlow for graph
            visualization, Tailwind CSS for styling
          </li>
          <li>
            <span className="font-semibold">Database:</span> Firebase
            Firestore for real-time data persistence
          </li>
          <li>
            <span className="font-semibold">Language:</span> TypeScript for
            type safety
          </li>
        </ul>
      </div>
    </div>
  );
}
