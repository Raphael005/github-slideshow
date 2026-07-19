# Bazel Setup

Bazel 9.2.0 installed via Homebrew on 2026-07-19.

## Installation

```zsh
brew install bazel
```

## Creating a Workspace

1. Create a project directory and `MODULE.bazel`:

```bazel
module(name = "my_project", version = "1.0")

bazel_dep(name = "rules_cc", version = "0.2.17")
```

2. Create a `BUILD.bazel` file (Bazel 9+ requires explicit rule loading):

```bazel
load("@rules_cc//cc:cc_binary.bzl", "cc_binary")

cc_binary(
    name = "hello",
    srcs = ["hello.cc"],
)
```

3. Build and run:

```zsh
bazel build //:hello
bazel run //:hello
```

## Zsh Completions

Completions installed to `/opt/homebrew/share/zsh/site-functions`.
