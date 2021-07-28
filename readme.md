# dbtex

[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg?style=flat-square)](license.md)
![Maintenance](https://img.shields.io/maintenance/yes/2021?color=brightgreen&style=flat-square) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/zhibirc/dbtex?color=brightgreen&style=flat-square) [![dependencies Status](https://status.david-dm.org/gh/zhibirc/dbtex.svg?style=flat-square)](https://david-dm.org/zhibirc/dbtex)
![Lines of code](https://img.shields.io/tokei/lines/github/zhibirc/dbtex?color=yellow&style=flat-square) ![GitHub repo size](https://img.shields.io/github/repo-size/zhibirc/dbtex?color=yellow&style=flat-square)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-magenta.svg)]()

**DBTEX** is a lightweight, flat-file, zero-dependant database designed for using in non-ACID and relatively simple Node.js applications as an external dependency.


## About

**DBTEX** tries to solve one particular aspect in building software -- storing application data. There are many approaches and specific software implementations here, one of which is _Flat-file databases_.
Generally speaking, **DBTEX** implements ideas of such databases with some additional mechanisms or enhancements, e.g. encryption. It stores data in uniform structured format which is determined by driver being used. Data store is persistent,
because application data is saved permanently to file system. **DBTEX** is not ACID-compatible by-design and doesn't offer the features comparable to "large" RDBMS. The main goal to use **DBTEX** may be minimizing amount of third-party code
in an application, because it has no dependencies, and it's size is relatively small. Another reason to use **DBTEX** may be an ability to "quick start", because it's API is concise and simple.
Oftentimes, application needs are scoped with CRUD operations, so **DBTEX** may be suitable for small and medium Node.js projects without high-load, ACID requirements, other advanced stuff and waste headache.


## Getting Started

Installation:

```shell
npm install dbtex

# or

yarn add dbtex
```

Initialize in application (see [API](#api) for detailed explanation):

```ts
import { DbTex } from 'dbtex';


// instantiate and create database (if not exists) in path: path-to-directory-with-database/name-of-database
const dbTex: DbTex = new DbTex({
    directory: 'database-parent-directory',
    name: 'database-name',
    fileSizeLimit: '1MB',
    encrypt: true
});
```


## API

`createTable`
`dropTable`
`audit`


## Contributing

I'm grateful to the community for contributing bug fixes and improvements. Read [checklist](./checklist.md) and [issues](https://github.com/zhibirc/dbtex/issues) to learn how specifically can you be helpful.
If nevertheless you decide to help to improve **DBTEX**, please read the [Contribution Guidelines](./contributing.md) first. Thank you!


## License

**DBTEX** is [MIT licensed](./license.md).
