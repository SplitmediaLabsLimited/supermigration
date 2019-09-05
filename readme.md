# SuperMigration - Easily perform table migrations in BigQuery

## Requirements

- BigQuery access
- An authenticated and working `gcloud`, or an `GOOGLE_APPLICATION_CREDENTIALS` environment variable pointing to a service account
- Node 10+

## Getting Started

```js
yarn add global supermigration
supermigration init
```

## Why?

SuperMigration (...naming stuff is super hard, sorry) is a command line tool to perform migrations in BigQuery. BigQuery is a really powerful data warehouse, unfortunately, once a table is created, there's a lot of restrictions. For example:

- You cannot modify or delete a column, only add new ones
- You cannot rename table
- You cannot change or add a partition column
- You cannot change or add a clustering column

If you want to do any of the above, you need to

- Create `TEMP_TABLE` with the correct schema
- Copy data from the `ORIGINAL_TABLE` table to `BACKUP_TABLE` (always backup your stuff, kids!)
- Copy data from the `ORIGINAL_TABLE` to the empty `TEMP_TABLE` table
- Delete `ORIGINAL_TABLE`
- Recreate `ORIGINAL_TABLE` with new schema
- Copy data from the `TEMP_TABLE` to the freshly new `ORIGINAL_TABLE`
- Delete `TEMP_TABLE`

We use to do this manually, but it's so easy to mess up.. so we created SuperMigration.

## What can SuperMigration do?

It can...

- ✅ Drops a table
- ✅ Copy a table
- ✅ Rename a table
- ✅ Alter a table

And keeps everything in neat files so you can add it to git, and make it go through code review.

A migration file looks like this:

```js
module.exports = {
  type: 'bigquery',
  action: 'alter',
  source: {
    // It's a query so that you can modify what you copy over
    query: 'SELECT * FROM `sml-bigquery.logs.App_Download`',
  },
  destination: {
    projectId: '<YourProjectHere>',
    datasetId: '<YourDataSetHere>',
    tableId: 'App_Download',
  },
  table: {
    // reference: https://cloud.google.com/bigquery/docs/reference/rest/v2/tables#resource
    timePartitioning: {
      type: 'DAY',
      field: 'Date_Time',
    },
    requirePartitionFilter: true,
    clustering: {
      fields: ['Application', 'Country', 'Client'],
    },
    schema: {
      fields: [
        {
          name: 'Date_Time',
          type: 'TIMESTAMP',
          mode: 'NULLABLE',
        },
        // ... omitted
      ],
    },
  },
};
```

## Future Plans

- Make it runnable in CI (`--no-interaction` kind of thing)
- Find a way to test this without testing in production 😂
- Add a log datasets to keep track of who ran what and when
- Replicate pt-online-schema-change so we can also perform big alters in MySQL
- ??

## Thanks to

- Google for making a dope data-warehouse for el cheapo
- [Gluegun](https://infinitered.github.io/gluegun/#/) for making a toolbox to make CLI in Node pretty easy
