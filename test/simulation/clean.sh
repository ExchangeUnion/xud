#!/bin/bash

delete_dir() {
	if ! rm -rf  $1 >/dev/null 2>&1; then
		echo "unable to delete directory $1"
		exit 1
	fi
	return 0
}

delete_dir "./go"
delete_dir "./xud"