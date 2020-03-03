deploy:
	npm version patch
	git push origin master
	git push heroku master
dev:
	NODE_ENV=development npm run dev | npm run start-dev