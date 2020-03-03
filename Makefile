deploy:
	npm version patch --force
	git add -A
	git commit -m "Deploy version (sh getPackageVersion.sh)"
	git push origin master
	git push heroku master
dev:
	NODE_ENV=development npm run dev | npm run start-dev