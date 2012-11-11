# GitVault

## Premise
GitVault provides a safe, reliable and centralised location to keep your git 
repos in compressed storage via the use of [git bundle](http://www.kernel.org/pub/software/scm/git/docs/git-bundle.html).

## What benefit does that give?

Aside from having local and validated copy of externally relied upon repository,
you can use the bundle permalink GitVault provides in your CI / project build
routines to provide faster clone times. The bundle is compressed and it can be
configured to only contain selected branches from the origin repo.

So, reliable and faster builds. Build local, build from a single compressed git
file and let GitVault take care of unreliable external repos.

Work in progress.

