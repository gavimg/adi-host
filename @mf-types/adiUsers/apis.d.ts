
    export type RemoteKeys = 'adiUsers/UsersApp';
    type PackageType<T> = T extends 'adiUsers/UsersApp' ? typeof import('adiUsers/UsersApp') :any;