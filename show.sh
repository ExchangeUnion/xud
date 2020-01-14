MAIN="master"
BRANCH="cli/aliases"

git diff --name-only $BRANCH $(git merge-base $BRANCH $MAIN)
