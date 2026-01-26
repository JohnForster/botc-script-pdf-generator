interface ScriptEditorProps {
  scriptText: string;
  onScriptChange: (text: string) => void;
  onSave: () => void;
}

export function ScriptEditor({
  scriptText,
  onScriptChange,
  onSave,
}: ScriptEditorProps) {
  return (
    <>
      <div className="script-editor-buttons">
        <button className="update-button">Update</button>
        <button onClick={onSave} className="update-button">
          Save
        </button>
      </div>
      <textarea
        className="script-editor-textarea"
        value={scriptText}
        onChange={(e) =>
          onScriptChange((e.target as HTMLTextAreaElement).value)
        }
        rows={20}
        spellcheck={false}
      />
    </>
  );
}
