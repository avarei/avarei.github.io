export function HealthSyncHelp() {
  return (
    <details className="health-sync-help">
      <summary>How does "Send to Health" work?</summary>
      <p>
        A web app can't write to Apple Health directly — there's no API for that. Instead, each
        "Send to Health" tap opens the <strong>Shortcuts</strong> app with the entry's data, and a
        Shortcut you build once does the actual logging. Steps to build it:
      </p>
      <ol>
        <li>
          Open <strong>Shortcuts</strong> → New Shortcut → name it exactly what you set below
          (default <code>Log Nutrition</code>).
        </li>
        <li>
          Add <strong>Split Text</strong> → Custom separator <code>|</code>. Input: Shortcut
          Input.
        </li>
        <li>
          Use <strong>Get Item from List</strong> (or Set Variable) to pull out each field, in
          order: name, kcal, protein, carbs, fat, quantity (g), timestamp.
        </li>
        <li>
          Add a Health-logging action — look for <strong>Log Nutrition</strong> / "Log Food" in
          the Health category (exact name varies by iOS version). Map the variables into its
          Energy / Protein / Carbohydrates / Fat fields. If no combined action exists on your iOS
          version, add one action per nutrient instead.
        </li>
        <li>If the action supports a custom date, set it from the timestamp field.</li>
        <li>Run it once manually in Shortcuts with sample text to confirm it logs correctly.</li>
      </ol>
      <p>
        iOS will show an "Open in Shortcuts?" prompt the first time you trigger this — that's
        expected.
      </p>
    </details>
  )
}
