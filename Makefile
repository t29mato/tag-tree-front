api-client:
	docker run --rm -v "${PWD}/api:/workspace" openapitools/openapi-generator-cli generate \
		-i /workspace/Starrydata-API.yaml \
		-g typescript-axios \
		-o /workspace/out/
