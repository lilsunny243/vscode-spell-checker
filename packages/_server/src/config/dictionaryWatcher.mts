import type { CSpellUserSettings } from '@cspell/cspell-types';

import { FileWatcher } from '../utils/fileWatcher.mjs';
import type { Disposable } from '../vscodeLanguageServer/index.cjs';

export type Listener = (eventType?: string, filename?: string) => void;

export class DictionaryWatcher extends FileWatcher implements Disposable {
    constructor() {
        super();
    }

    processSettings(finalizedSettings: CSpellUserSettings): void {
        // Only watch used dictionaries.
        const defs = new Map(finalizedSettings.dictionaryDefinitions?.map((def) => [def.name, def.path]));
        finalizedSettings.dictionaries
            ?.map((name) => defs.get(name))
            .filter((s): s is string => !!s)
            .forEach((file) => this.addFile(file));
    }
}
