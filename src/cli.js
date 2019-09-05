const { build } = require('gluegun');

/**
 * Create the cli and kick it off
 */
async function run(argv) {
  // create a CLI runtime
  const cli = build()
    .brand('supermigration')
    .exclude([
      // 'meta',
      // 'strings',
      // 'print',
      // 'filesystem',
      // 'semver',
      // 'system',
      'prompt',
      'http',
      'template',
      'patching',
    ])
    .src(__dirname)
    .plugins('./node_modules', { matching: 'supermigration-*', hidden: true })
    .help() // provides default for help, h, --help, -h
    .version() // provides default for version, v, --version, -v
    .checkForUpdates(5)
    .create();

  // and run it
  const toolbox = await cli.run(argv);

  // send it back (for testing, mostly)
  return toolbox;
}

module.exports = { run };
