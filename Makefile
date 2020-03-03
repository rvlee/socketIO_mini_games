deploy:
	npm version patch --force
	git add -A
	git commit -m "(sh getPackageVersion.sh)"
	git push origin master
	git push heroku master