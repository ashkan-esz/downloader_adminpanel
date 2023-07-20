build-image:
	docker image build -t downloader-adminpanel --network=host .

run-image:
	docker run --network=host --memory 500m --memory-swap 750m --cpus=".5" -p 7000:7000 --env-file ./.env downloader-adminpanel

compose-image:
	docker-compose up --build

build-dev:
	docker build -f Dockerfile.dev -t downloader-adminpanel --network=host .

run-dev:
	docker run -it --rm --network=host -p 5000:5000 --env-file ./.env downloader-adminpanel

compose-dev:
	docker-compose -f docker-compose.dev.yml up --build

push-image:
	docker tag downloader-adminpanel ashkanaz2828/downloader_adminpanel
	docker push ashkanaz2828/downloader_adminpanel