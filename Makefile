deploy:
	npm version patch --force
	git add -A
	git commit -m
test:
	npm version patch --force
	git add -A
	git commit -m "(sh test.sh)"
