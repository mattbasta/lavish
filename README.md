# Lavish

A web-based terminal emulator to replace your grandfather's *NIX shell. Command line interfaces haven't changed much in the last thirty years. This project is designed as a continuation of the [TermKit](https://github.com/unconed/TermKit) application, with a few notable differences:

1. **The front-end lives in the browser.** This makes the application much more portable, as dependencies on Webkit are removed.
2. **The back-end is powered by Dart.** Dart is a very powerful language that offers flexibility equal to or great than that of JavaScript while providing support for features like reflection, type enforcement, and functional data processing.


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
