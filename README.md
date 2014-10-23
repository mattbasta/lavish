# Lavish

A web-based terminal emulator to replace your grandfather's *NIX shell. Command line interfaces haven't changed much in the last thirty years. This project is designed as a continuation of the [TermKit](https://github.com/unconed/TermKit) application, with a few notable differences:

1. **The front-end lives in the browser.** This makes the application much more portable, as dependencies on WebKit are removed.
2. **The back-end is powered by Go.** Go is statically typed but offers flexible enough interfaces for the purposes of a shell. Go is wickedly fast.

Traditionally, shells have been a combination of technologies and lacked separation of responsibility. Each shell accepts commands and produces output, but the output is almost always a mixed blob and the input is almost always an opaque (i.e., difficult to parse or manipulate) query.

Lavish serves as the "CouchDB of shells". The back-end accepts structured queries in a computer-friendly format along a common protocol and produces typed, streaming responses. The front-end allows for human-friendly query generation and makes it easy to manage multiple concurrent operations. 


## Goals

- To make it fast and easy to perform complex shell commands
- To structure commands in a way that makes them easy to modify
- To allow users to execute multiple simultaneous commands without needing tabs
- To provide means of visualizing and interpreting output for all commands
    + Syntax highlighting
    + `less` support by default
    + Separation of stdout and stderr
- To assign types to common commands to reduce debugging time

Lavish is not designed as a complete shell replacement for all users, nor will it likely ever be. Instead, Lavish seeks to serve the 75th percentile user. Rough edges in Lavish can be worked around using the `sh` command, which simply defers its input to the default system shell.


## Running

Link the directory that you cloned Lavish into to the path `/opt/lavish`. Run `make` to compile.

To start the local server:

```bash
./lavish
```

You should be able to access the shell interface on localhost at port 4640 by default, though you should be able to customize this with the `--port` argument.


## Syntax

There are two shell modes:

1. Visual mode
2. Text mode

Visual mode allows you to construct commands using visual cues. The shell tries to use sane keyboard commands to make this seamless.

Text mode allows for raw command input. Unlike traditional shells, text mode uses a stricter structured syntax for commands. For example:

```
lineCount(grep(ls("~/dir/"), "pattern"))
```


## Disclaimer

This application is purely experimental. You should not use it in production setting.


## License

The MIT License (MIT)

Copyright (c) 2014 Matt Basta

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
