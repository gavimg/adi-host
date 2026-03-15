
    export type RemoteKeys = 'adiSettings/SettingsApp';
    type PackageType<T> = T extends 'adiSettings/SettingsApp' ? typeof import('adiSettings/SettingsApp') :any;