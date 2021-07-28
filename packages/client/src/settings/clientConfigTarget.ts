import type { Uri } from 'vscode';

export type ClientConfigKind = 'cspell' | 'dictionary' | 'vscode';
export type ClientConfigScopeVScode = 'user' | 'workspace' | 'folder';
export type ClientConfigScope = ClientConfigScopeVScode | 'unknown';

interface ClientConfigTargetBase {
    /** type of target */
    kind: ClientConfigKind;
    /** scope of target */
    scope: ClientConfigScope;
    /** friendly name of config target */
    name: string;
    /** Document Uri */
    docUri?: Uri;
}

export interface ClientConfigTargetDictionary extends ClientConfigTargetBase {
    kind: 'dictionary';
    /** uri path to custom dictionary */
    dictionaryUri: Uri;
}

export interface ClientConfigTargetCSpell extends ClientConfigTargetBase {
    kind: 'cspell';
    /** uri path to config file */
    configUri: Uri;
}

export interface ClientConfigTargetVSCodeUser extends ClientConfigTargetBase {
    kind: 'vscode';
    scope: 'user';
    docUri: Uri | undefined;
}

export interface ClientConfigTargetVSCodeWorkspace extends ClientConfigTargetBase {
    kind: 'vscode';
    scope: 'workspace';
    docUri: Uri;
}

export interface ClientConfigTargetVSCodeFolder extends ClientConfigTargetBase {
    kind: 'vscode';
    scope: 'folder';
    docUri: Uri;
}

export type ClientConfigTargetVSCode = ClientConfigTargetVSCodeUser | ClientConfigTargetVSCodeWorkspace | ClientConfigTargetVSCodeFolder;

export type ClientConfigTarget = ClientConfigTargetDictionary | ClientConfigTargetCSpell | ClientConfigTargetVSCode;

type ClientConfigKinds = {
    [key in ClientConfigKind as `${Capitalize<key>}`]: key;
};

type ClientConfigScopes = {
    [key in ClientConfigScope as `${Capitalize<key>}`]: key;
};

type ConfigKindToTarget = {
    [key in ClientConfigTarget['kind']]: key extends ClientConfigTargetDictionary['kind']
        ? ClientConfigTargetDictionary
        : key extends ClientConfigTargetCSpell['kind']
        ? ClientConfigTargetCSpell
        : key extends ClientConfigTargetVSCode['kind']
        ? ClientConfigTargetVSCode
        : never;
};

export const ConfigKinds: ClientConfigKinds = {
    Dictionary: 'dictionary',
    Cspell: 'cspell',
    Vscode: 'vscode',
};

export const ConfigScopes: ClientConfigScopes = {
    Unknown: 'unknown',
    User: 'user',
    Workspace: 'workspace',
    Folder: 'folder',
};

function isA<T extends ClientConfigTarget>(kind: T['kind']) {
    return (t: T | ClientConfigTarget): t is T => typeof t === 'object' && t.kind === kind;
}

export function isClientConfigTargetOfKind<K extends ClientConfigKind>(
    t: ConfigKindToTarget[K] | ClientConfigTarget,
    kind: K
): t is ConfigKindToTarget[K] {
    return typeof t === 'object' && t.kind === kind;
}

export const isClientConfigTargetDictionary = isA<ClientConfigTargetDictionary>(ConfigKinds.Dictionary);
export const isClientConfigTargetCSpell = isA<ClientConfigTargetCSpell>(ConfigKinds.Cspell);
export const isClientConfigTargetVSCode = isA<ClientConfigTargetVSCode>(ConfigKinds.Vscode);