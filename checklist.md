# Check/Task List


## Features

- [ ] determine the scope what exactly the `audit` instance method should check and describe it in JSDoc
- [ ] possibly use checksums calculation for deterministic audit
- [ ] investigate and design **DBTEX** usage for logging tasks (assume only data appending)
- [ ] research on idea about network driver for remote storage and driver compositions
- [ ] implement mechanism similar to `expireAfter`(TTL) for table records
- [ ] implement indexing, probably via API method `createIndex`
- [ ] add API for creating `unique` index ensures that the indexed fields don't store duplicate values
- [ ] implement `autosave` mode for immediate writing to file and deferred saving


## Documentation

- [ ] add necessary packages for generation JSDoc-based project documentation, test them
- [ ] add detailed explanations and usage examples in project's [wiki](https://github.com/zhibirc/dbtex/wiki)


## Testing

- [ ] add unit tests for class `DbTex`
- [ ] add unit tests for class `Table`
- [ ] add unit tests for `utilities/*`
