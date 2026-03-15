
    export type RemoteKeys = 'adiReports/ReportsApp';
    type PackageType<T> = T extends 'adiReports/ReportsApp' ? typeof import('adiReports/ReportsApp') :any;