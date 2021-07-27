# dbtex

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

Initialize in application:

```ts
import { DbTex } from 'dbtex';


// instantiate and create database (if not exists) in path: path-to-directory-with-database/name-of-database
const dbTex = new DbTex({
    directory: 'path-to-directory-with-database',
    name: 'name-of-database'
});
```


## Contributing

I'm grateful to the community for contributing bug fixes and improvements. Read [checklist](./checklist.md) and [issues](https://github.com/zhibirc/dbtex/issues) to learn how can you be helpful.


## License

**DBTEX** is [MIT licensed](./license.md).
