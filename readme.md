# dbtex

[![GitHub](https://img.shields.io/github/license/mashape/apistatus.svg)](license.md)
![Maintenance](https://img.shields.io/maintenance/yes/2023?color=brightgreen) ![GitHub commit activity](https://img.shields.io/github/commit-activity/m/zhibirc/dbtex?color=brightgreen) [![dependencies Status](https://status.david-dm.org/gh/zhibirc/dbtex.svg)](https://david-dm.org/zhibirc/dbtex)
![Lines of code](https://img.shields.io/tokei/lines/github/zhibirc/dbtex?color=yellow) ![GitHub repo size](https://img.shields.io/github/repo-size/zhibirc/dbtex?color=yellow)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-magenta.svg)]()

**DbTex** is a lightweight, flat-file, embedded, zero-dependant database designed for using in non-ACID and relatively simple Node.js applications as an external dependency.


## About

**DbTex** tries to solve one particular aspect in building software -- storing application data. There are many approaches and specific software implementations here, one of which is _Flat-file databases_.
Generally speaking, **DbTex** implements ideas of such databases with some additional mechanisms or enhancements, e.g. encryption. It stores data in uniform structured format which is determined by driver being used. Data store is persistent,
because application data is saved permanently to file system. **DbTex** is not ACID-compatible by-design and doesn't offer the features comparable to "large" RDBMS. The main goal to use **DbTex** may be minimizing amount of third-party code
in an application, because it has no dependencies, and it's size is relatively small. Another reason to use **DbTex** may be an ability to "quick start", because it's API is concise and simple.
Oftentimes, application needs are scoped with CRUD operations, so **DbTex** may be suitable for small and medium Node.js projects without high-load, ACID requirements, other advanced stuff and waste headache.


## Architecture

Despite the [API](#api) exposes the high abstract convenient methods for data manipulation, there are several encapsulated details and under-the-hood concepts that should be described.

1) **DbTex** provides persistent storage mechanism where application's data are stored in plaint-text (MIME -- `text/plain`, extension -- `.txt`) files/flatfiles in UTF-8 character encoding.
   These files represent the database table data and organized appropriately. Generally, a storage structure in **DbTex** looks like as following:

   ```text
   databases_parent_directory/
       ├── database_directory/
           ├── meta.json
           ├── [prefix]table_1/
               ├── 1_<timestamp>_file.txt
               ├── ...
               └── N_<timestamp>_file.txt
           ├── ...
           └── [prefix]table_N
   ```

   Database metadata is stored in `meta.json` file in its root directory. This file contains all database instance related information and is closely synchronized with database structure and reflects all updates.

2) Record/row in **DbTex** terms is a character sequence terminated with line-break. This sequence consists of two types of symbols: _semantic_ sub-sequences and _delimiters_. What a delimiter should be
   is defined by the driver being used. There are two common delimiters using for delimiter-separated values: commas in comma-separated values (CSV) and tabs in tab-separated values (TSV).
   There are two such currently supported built-in drivers. It's possible to use a custom driver with an arbitrary delimiter and corresponding read/write logic.
   Driver type should be specified during **DbTex** initialization, otherwise CSV format will be used.

3) **DbTex** is developed around so-called "navigational" principle, so read/write procedures are implemented using direct imperative traversing on table records.


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


// Instantiate and create database (if not exists) in path: database-parent-directory/name-of-database.
// Also specify the file size limit for table data and that it should be encrypted with built-in encoder.
const dbTex: DbTex = new DbTex({
    location: 'databases_parent_directory',
    name: 'database_name',
    fileSizeLimit: '1MB',
    encrypt: true
});
```


## API

**DbTex**

| Name             | Access  | Type     | Description |
|------------------|---------|----------|-------------|
| `location`       | public  | property | Absolute path to database directory (where meta-info and all tables data are stored). |
| `audit`          | public  | method   | Load data from meta-info file, verify all metrics being read, and compare with real database structure. |
| `createTable`    | public  | method   | Create table in current database and update of database meta-info metrics. |
| `dropTable`      | public  | method   | Drop an existing table and update of database meta-info metrics. |
| `getStats`       | public  | method   | Get statistics about database: general metrics, tables, paths, disk utilization, etc. |
| `setHook`        | public  | method   | Set (add new or update of existing) additional procedure as a middleware to the CRUD flow. |
| `shutdown`       | public  | method   | Terminate database process gracefully. |
||
| `types`          | static  | method   | Enumeration of supported types for table fields. |
||
| `config`         | private | property | Main application config. |
| `sanitizeConfig` | private | method   | User/external configuration sanitizer. |
| `init`           | private | method   | Parse given config, analyze, merge with existing if any, and initialize inner structures. |
| `save`           | private | method   | Save database configuration and state to meta file with checksum. |


## Contributing

I'm grateful to the community for contributing bug fixes and improvements. Read [checklist](./checklist.md) and [issues](https://github.com/zhibirc/dbtex/issues) to learn how specifically can you be helpful.
If nevertheless you decide to help to improve **DbTex**, please read the [Contribution Guidelines](./contributing.md) first. Thank you!


## License

**DbTex** is licensed under the terms of the [MIT license](./license.md).
