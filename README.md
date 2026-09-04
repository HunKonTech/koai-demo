# KOAI — UI demo

Published automatically from the private `KOAI_source_code` repository. **Do not
commit here** — this branch is replaced wholesale by each publish.

| Page | Built from |
| --- | --- |
| [/](https://hunkontech.github.io/koai-demo/) | the latest public release |
| [/dev/](https://hunkontech.github.io/koai-demo/dev/) | the latest developer preview |

Each page is the real KOAI interface (the same Razor components the desktop app
renders) compiled to WebAssembly, running against a stand-in service layer. Nothing
on it reaches a network: no research runs, no model is loaded, no audio is
synthesized, and every figure shown is invented sample data.
