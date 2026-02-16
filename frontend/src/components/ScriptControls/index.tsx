import { ScriptOptions } from "botc-character-sheet";
import type { SaveStatus } from "../../hooks/useSavedScripts";
import { CollapsibleSection } from "../ui";
import { UploadSection } from "./UploadSection";
import { AppearanceOptions } from "./AppearanceOptions";
import { FontOptions } from "./FontOptions";
import { CharacterSheetOptions } from "./CharacterSheetOptions";
import { CharacterSheetBackOptions } from "./CharacterSheetBackOptions";
import { PrintOptions } from "./PrintOptions";
import { ActionButtons } from "./ActionButtons";
import { ScriptEditor } from "../ScriptEditor";

interface ScriptControlsProps {
  hasScript: boolean;
  options: ScriptOptions;
  isScriptSorted: boolean;
  scriptText: string;
  error: string | null;
  onFileUpload: (event: Event) => void;
  onLoadExample: () => void;
  onLoadExampleTeensyville: () => void;
  onColorChange: (color: string | string[]) => void;
  onColorArrayChange: (index: number, color: string) => void;
  onAddColor: () => void;
  onRemoveColor: (index: number) => void;
  onLogoChange: (logo: string) => void;
  onOptionChange: <K extends keyof ScriptOptions>(
    key: K,
    value: ScriptOptions[K],
  ) => void;
  onSort: () => void;
  onGeneratePDF: () => void;
  onGenerateImages: () => void;
  onPrint: () => void;
  onShare: () => void;
  isSharing: boolean;
  shareUrl: string | null;
  shareError: string | null;
  onSaveToLibrary: () => void;
  saveStatus: SaveStatus;
  onScriptChange: (text: string) => void;
  onSave: () => void;
}

export function ScriptControls({
  hasScript,
  options,
  isScriptSorted,
  scriptText,
  error,
  onFileUpload,
  onLoadExample,
  onLoadExampleTeensyville,
  onColorChange,
  onColorArrayChange,
  onAddColor,
  onRemoveColor,
  onLogoChange,
  onOptionChange,
  onSort,
  onGeneratePDF,
  onGenerateImages,
  onPrint,
  onShare,
  isSharing,
  shareUrl,
  shareError,
  onSaveToLibrary,
  saveStatus,
  onScriptChange,
  onSave,
}: ScriptControlsProps) {
  return (
    <>
      <h1 className="app-title">
        Blood on the Clocktower Fancy Script Generator
      </h1>

      <div className="control-panel">
        <UploadSection
          hasScript={hasScript}
          onFileUpload={onFileUpload}
          onLoadExample={onLoadExample}
          onLoadExampleTeensyville={onLoadExampleTeensyville}
        />

        {hasScript && (
          <>
            <p style={{ textAlign: "center", margin: 0 }}>
              If you have any feedback, please let me know{" "}
              <a href="https://forms.gle/z1yeAW7x91X4Uc4H8">here</a>.
            </p>
            <ActionButtons
              isScriptSorted={isScriptSorted}
              error={error}
              onSort={onSort}
              onGeneratePDF={onGeneratePDF}
              onGenerateImages={onGenerateImages}
              onPrint={onPrint}
              onShare={onShare}
              isSharing={isSharing}
              shareUrl={shareUrl}
              shareError={shareError}
              onSaveToLibrary={onSaveToLibrary}
              saveStatus={saveStatus}
            />

            <CollapsibleSection title="General">
              <AppearanceOptions
                options={options}
                onOptionChange={onOptionChange}
                onColorChange={onColorChange}
                onColorArrayChange={onColorArrayChange}
                onAddColor={onAddColor}
                onRemoveColor={onRemoveColor}
                onLogoChange={onLogoChange}
              />
            </CollapsibleSection>

            <CollapsibleSection title="Font" defaultOpen={false}>
              <FontOptions
                titleStyle={options.titleStyle}
                onTitleStyleChange={(key, value) =>
                  onOptionChange("titleStyle", {
                    ...options.titleStyle,
                    [key]: value,
                  })
                }
              />
            </CollapsibleSection>

            <CollapsibleSection title="Character Sheet" defaultOpen={false}>
              <CharacterSheetOptions
                options={options}
                onOptionChange={onOptionChange}
              />
            </CollapsibleSection>

            {options.overleaf !== "none" && (
              <CollapsibleSection
                title="Character Sheet Back"
                defaultOpen={false}
              >
                <CharacterSheetBackOptions
                  options={options}
                  onOptionChange={onOptionChange}
                />
              </CollapsibleSection>
            )}

            <CollapsibleSection title="Print Options" defaultOpen={false}>
              <PrintOptions options={options} onOptionChange={onOptionChange} />
            </CollapsibleSection>

            <CollapsibleSection title="Edit Script JSON" defaultOpen={false}>
              <ScriptEditor
                scriptText={scriptText}
                onScriptChange={onScriptChange}
                onSave={onSave}
              />
            </CollapsibleSection>
          </>
        )}
      </div>
    </>
  );
}
