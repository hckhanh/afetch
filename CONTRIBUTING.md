## Contribute

Contributions of any kind (pull requests, bug reports, feature requests, documentation, design) are more than welcome! If you like this project and want to help, but feel like you are stuck, feel free to contact the maintainer.

### Building from source

Building the project should be quick and easy. If it isn't, it's the maintainer's fault. Please report any problems with building in a GitHub issue.

You need to have a reasonably recent version of bun and node.js to build *fast-url*.

First, clone the git repository:

```
git clone git@github.com:hckhanh/fast-url.git
```

Then switch to the newly created fast-url directory and install the dependencies:

```
cd fast-url
bun install
```

You can then run the unit tests to verify that everything works correctly:

```
bun test
```

And finally, build the library:

```
bun run build
```

The output will appear in the `dist` directory.

To check code quality and formatting:

```
bun biome check
```

Happy hacking!
